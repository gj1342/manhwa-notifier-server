import axios from 'axios';
import * as cheerio from 'cheerio';
import scrapingConfigRepository from '../repository/scrapingConfigRepository.js';
import logger from '../config/logger.js';
import { BaseError, BadRequestError } from '../utils/errors.js';
import { ERROR_MESSAGES, LOG_MESSAGES, SCRAPER_CONFIG, STATUS_CODES } from '../config/common.js';
import { format } from 'util';

const processChapterElement = (element, baseUrl) => {
  const chapterText = element.text().trim();
  let chapterUrl = null;

  const relativeUrl = element.attr('href');
  if (relativeUrl) {
    try {
      chapterUrl = new URL(relativeUrl, baseUrl).href;
    } catch (e) {
      logger.error(format(LOG_MESSAGES.INVALID_CHAPTER_URL, relativeUrl, baseUrl));
      return null;
    }
  }

  if (chapterText && chapterUrl) {
    return { text: chapterText, url: chapterUrl };
  }
  return null;
};

export const scrapeLatestMangaChapter = async (mangaUrl) => {
  let urlObj;
  try {
    urlObj = new URL(mangaUrl);
  } catch (e) {
    logger.error(format(LOG_MESSAGES.INVALID_MANGA_URL, mangaUrl));
    throw new BadRequestError(ERROR_MESSAGES.INVALID_URL_FOR_SCRAPING);
  }

  const { hostname, origin: baseUrl } = urlObj;
  const config = await scrapingConfigRepository.getScrapingConfig(hostname);

  if (!config) {
    logger.warn(format(LOG_MESSAGES.NO_SCRAPING_CONFIG, hostname));
    return null;
  }

  let htmlContent;
  try {
    const response = await axios.get(mangaUrl, {
      headers: {
        'User-Agent': SCRAPER_CONFIG.USER_AGENT,
      },
    });
    htmlContent = response.data;
  } catch (error) {
    logger.error(format(LOG_MESSAGES.FETCH_HTML_ERROR, mangaUrl, error.message));
    throw new BaseError(ERROR_MESSAGES.FETCH_URL_FAILED, STATUS_CODES.SERVER_ERROR);
  }

  try {
    const $ = cheerio.load(htmlContent);
    const chapters = [];

    $(config.chapterSelector).each((index, element) => {
      const chapter = processChapterElement($(element), baseUrl);
      if (chapter) {
        chapters.push(chapter);
      }
    });

    if (chapters.length > 0) {
      const latestChapter = chapters[0];
      logger.info(format(LOG_MESSAGES.LATEST_CHAPTER_FOUND, mangaUrl, latestChapter.text));
      return latestChapter;
    }

    logger.warn(format(LOG_MESSAGES.NO_CHAPTERS_FOUND, mangaUrl, config.chapterSelector));
    return null;
  } catch (error) {
    logger.error(format(LOG_MESSAGES.SCRAPING_ERROR, mangaUrl, error.message));
    throw new BaseError(ERROR_MESSAGES.PARSE_CONTENT_FAILED, STATUS_CODES.SERVER_ERROR);
  }
}; 