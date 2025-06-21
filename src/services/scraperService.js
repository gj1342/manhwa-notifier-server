import axios from 'axios';
import HttpsProxyAgent from 'axios-https-proxy-fix';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import scrapingConfigRepository from '../repository/scrapingConfigRepository.js';
import logger from '../config/logger.js';
import { BaseError, BadRequestError } from '../utils/errors.js';
import {
  ERROR_MESSAGES,
  LOG_MESSAGES,
  SCRAPER_CONFIG,
  STATUS_CODES,
  SYSTEM_CONSTANTS,
  PROXY_CONFIG,
} from '../config/common.js';
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

const parseHtmlContent = (htmlContent, config, baseUrl) => {
  const $ = cheerio.load(htmlContent);
  const chapters = [];

  $(config.chapterSelector).each((index, element) => {
    const chapter = processChapterElement($(element), baseUrl);
    if (chapter) {
      chapters.push(chapter);
    }
  });

  if (chapters.length > 0) {
    const latestChapter = chapters[0]; // Assuming the first element is the latest
    logger.info(format(LOG_MESSAGES.LATEST_CHAPTER_FOUND, baseUrl, latestChapter.text));
    return latestChapter;
  }

  logger.warn(format(LOG_MESSAGES.NO_CHAPTERS_FOUND, baseUrl, config.chapterSelector));
  return null;
};

const scrapeWithAxios = async (mangaUrl, proxy) => {
  const options = {
    headers: { 'User-Agent': SCRAPER_CONFIG.USER_AGENT },
  };

  if (proxy) {
    logger.info(format(LOG_MESSAGES.USING_PROXY, proxy.split('@')[1] || proxy));
    options.httpsAgent = new HttpsProxyAgent(proxy);
    options.proxy = false;
  }

  try {
    const response = await axios.get(mangaUrl, options);
    return response.data;
  } catch (error) {
    logger.error(format(LOG_MESSAGES.FETCH_HTML_ERROR, mangaUrl, error.message));
    throw new BaseError(ERROR_MESSAGES.FETCH_URL_FAILED, STATUS_CODES.SERVER_ERROR);
  }
};

const scrapeWithPuppeteer = async (mangaUrl, proxy) => {
  let browser;
  const launchOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };

  if (proxy) {
    logger.info(format(LOG_MESSAGES.USING_PROXY, proxy.split('@')[1] || proxy));
    launchOptions.args.push(`--proxy-server=${proxy}`);
  }

  try {
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.goto(mangaUrl, { waitUntil: 'networkidle2' });
    const content = await page.content();
    return content;
  } catch (error) {
    logger.error(format(LOG_MESSAGES.PUPPETEER_ERROR, mangaUrl, error.message));
    throw new BaseError(ERROR_MESSAGES.FETCH_URL_FAILED, STATUS_CODES.SERVER_ERROR);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export const scrapeManga = async (mangaUrl) => {
  let urlObj;
  try {
    urlObj = new URL(mangaUrl);
  } catch (e) {
    logger.error(format(LOG_MESSAGES.INVALID_MANGA_URL, mangaUrl));
    throw new BadRequestError(ERROR_MESSAGES.INVALID_URL_FOR_SCRAPING);
  }

  const { hostname, origin: baseUrl } = urlObj;
  const config = await scrapingConfigRepository.getScrapingConfig({
    domain: hostname,
  });

  if (!config) {
    logger.warn(format(LOG_MESSAGES.NO_SCRAPING_CONFIG, hostname));
    throw new BadRequestError(format(ERROR_MESSAGES.SCRAPING_UNSUPPORTED, hostname));
  }

  const proxy = PROXY_CONFIG.getProxy();
  let htmlContent;

  try {
    if (config.scrapingStrategy === SYSTEM_CONSTANTS.SCRAPER_STRATEGY_DYNAMIC) {
      htmlContent = await scrapeWithPuppeteer(mangaUrl, proxy);
    } else {
      htmlContent = await scrapeWithAxios(mangaUrl, proxy);
    }

    if (!htmlContent) {
      throw new BaseError(ERROR_MESSAGES.FETCH_URL_FAILED, STATUS_CODES.SERVER_ERROR);
    }

    return parseHtmlContent(htmlContent, config, baseUrl);
  } catch (error) {
    // Errors from helpers are already logged, re-throw to be caught by controller/job
    if (error instanceof BaseError) {
      throw error;
    }
    // For unexpected errors during parsing
    logger.error(format(LOG_MESSAGES.SCRAPING_ERROR, mangaUrl, error.message));
    throw new BaseError(ERROR_MESSAGES.PARSE_CONTENT_FAILED, STATUS_CODES.SERVER_ERROR);
  }
};
