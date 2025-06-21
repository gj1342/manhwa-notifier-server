import trackedMangaRepository from '../repository/trackedMangaRepository.js';
import { scrapeManga } from '../services/scraperService.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import { ERROR_MESSAGES, STATUS_CODES } from '../config/common.js';

export const createManga = async (req, res, next) => {
  try {
    const { url, mangaTitle } = req.body;
    const userId = req.user.id;

    const latestChapter = await scrapeManga(url);

    if (!latestChapter) {
      throw new BadRequestError(ERROR_MESSAGES.WEBSITE_NOT_SUPPORTED_OR_NO_CHAPTERS);
    }

    const newMangaData = {
      userId,
      url,
      mangaTitle,
      lastKnownChapter: latestChapter.text,
      lastKnownChapterUrl: latestChapter.url,
      lastCheckedAt: new Date(),
      lastUpdatedAt: new Date(),
    };

    const createdManga = await trackedMangaRepository.createTrackedManga(newMangaData);
    res.status(STATUS_CODES.CREATED).json(createdManga);
  } catch (error) {
    next(error);
  }
};

export const getMangas = async (req, res, next) => {
  try {
    const mangas = await trackedMangaRepository.getTrackedMangas({ userId: req.user.id });
    res.json(mangas);
  } catch (error) {
    next(error);
  }
};

export const getManga = async (req, res, next) => {
  try {
    const { id } = req.params;
    const manga = await trackedMangaRepository.getTrackedManga({ _id: id, userId: req.user.id });
    if (!manga) {
      throw new NotFoundError(ERROR_MESSAGES.MANGA_NOT_FOUND_OR_NO_PERMISSION);
    }
    res.json(manga);
  } catch (error) {
    next(error);
  }
};

export const updateManga = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notificationEnabled } = req.body;

    const manga = await trackedMangaRepository.updateTrackedManga(
      { _id: id, userId: req.user.id },
      { notificationEnabled }
    );

    if (!manga) {
      throw new NotFoundError(ERROR_MESSAGES.MANGA_NOT_FOUND_OR_NO_PERMISSION);
    }
    res.json(manga);
  } catch (error) {
    next(error);
  }
};

export const deleteManga = async (req, res, next) => {
  try {
    const { id } = req.params;
    const manga = await trackedMangaRepository.deleteTrackedManga({ _id: id, userId: req.user.id });

    if (!manga) {
      throw new NotFoundError(ERROR_MESSAGES.MANGA_NOT_FOUND_OR_NO_PERMISSION);
    }
    res.status(STATUS_CODES.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
}; 