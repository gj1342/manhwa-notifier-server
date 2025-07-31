import cron from 'node-cron';
import PQueue from 'p-queue';
import logger from '../config/logger.js';
import trackedMangaRepository from '../repository/trackedMangaRepository.js';
import userRepository from '../repository/userRepository.js';
import notificationQueueRepository from '../repository/notificationQueueRepository.js';
import { scrapeManga } from '../services/scraperService.js';
import { sendLocalizedMail } from '../services/emailService.js';
import { format } from 'util';
import {
  LOG_MESSAGES,
  SCRAPER_CONFIG,
  SYSTEM_CONSTANTS,
  MANGA_CHECKER_CONFIG,
} from '../config/common.js';

const processManga = async (manga) => {
  try {
    logger.info(format(LOG_MESSAGES.CRON_JOB_CHECKING_MANGA, manga.mangaTitle, manga.url));
    const latestChapter = await scrapeManga(manga.url);

    await trackedMangaRepository.updateTrackedManga(manga._id, { lastCheckedAt: new Date() });

    if (latestChapter && latestChapter.url !== manga.lastKnownChapterUrl) {
      logger.info(format(LOG_MESSAGES.CRON_JOB_NEW_CHAPTER_FOUND, manga.mangaTitle, latestChapter.text));

      const user = await userRepository.getUser({ _id: manga.userId });
      if (user && user.email) {
        const { frequency } = user.notificationSettings;

        if (frequency === SYSTEM_CONSTANTS.NOTIFICATION_FREQUENCIES[0]) {
          // 'instant'
          await sendLocalizedMail({
            to: user.email,
            subjectKey: MANGA_CHECKER_CONFIG.INSTANT_EMAIL_SUBJECT_KEY,
            bodyKey: MANGA_CHECKER_CONFIG.INSTANT_EMAIL_BODY_KEY,
            data: {
              mangaTitle: manga.mangaTitle,
              chapterText: latestChapter.text,
              chapterUrl: latestChapter.url,
            },
            lang: user.language || 'en',
          });
          logger.info(format(LOG_MESSAGES.CRON_JOB_NOTIFICATION_SENT, user.email, manga.mangaTitle));
        } else {
          // For 'daily' or 'weekly', queue the notification
          await notificationQueueRepository.createNotification({
            userId: user._id,
            mangaId: manga._id,
            mangaTitle: manga.mangaTitle,
            chapterText: latestChapter.text,
            chapterUrl: latestChapter.url,
          });
          logger.info(format(LOG_MESSAGES.CRON_JOB_NOTIFICATION_QUEUED, user.email, manga.mangaTitle));
        }
      }

      await trackedMangaRepository.updateTrackedManga(manga._id, {
        lastKnownChapter: latestChapter.text,
        lastKnownChapterUrl: latestChapter.url,
        lastUpdatedAt: new Date(),
      });
    } else if (!latestChapter) {
      logger.warn(format(LOG_MESSAGES.CRON_JOB_NO_CHAPTER_DETECTED, manga.mangaTitle));
    } else {
      logger.info(format(LOG_MESSAGES.CRON_JOB_NO_UPDATE, manga.mangaTitle));
    }
  } catch (error) {
    logger.error(
      format(LOG_MESSAGES.CRON_JOB_MANGA_CHECK_FAILED, manga.mangaTitle, manga.url, error.message)
    );
  }
};

const scheduledCheck = async () => {
  logger.info(LOG_MESSAGES.CRON_JOB_START);

  const allTrackedManga = await trackedMangaRepository.getTrackedMangas({
    notificationEnabled: true,
  });

  if (!allTrackedManga || allTrackedManga.length === 0) {
    logger.info(LOG_MESSAGES.CRON_JOB_NO_MANGAS);
    return;
  }

  logger.info(format(LOG_MESSAGES.CRON_JOB_MANGAS_TO_CHECK, allTrackedManga.length));

  const mangaByDomain = allTrackedManga.reduce((acc, manga) => {
    try {
      const domain = new URL(manga.url).hostname;
      if (!acc[domain]) {
        acc[domain] = [];
      }
      acc[domain].push(manga);
    } catch (e) {
      logger.error(format(LOG_MESSAGES.CRON_JOB_INVALID_URL, manga._id, manga.url));
    }
    return acc;
  }, {});

  const domainPromises = Object.entries(mangaByDomain).map(([domain, mangas]) => {
    const queue = new PQueue({
      interval: SCRAPER_CONFIG.RATE_LIMIT_INTERVAL_MS,
      intervalCap: SCRAPER_CONFIG.RATE_LIMIT_REQUESTS,
    });
    logger.info(
      format(LOG_MESSAGES.CRON_JOB_PROCESSING_DOMAIN, mangas.length, domain)
    );
    for (const manga of mangas) {
      queue.add(() => processManga(manga));
    }
    return queue.onIdle();
  });

  await Promise.all(domainPromises);
  logger.info(LOG_MESSAGES.CRON_JOB_COMPLETE);
};

// Schedule to run every hour
const job = cron.schedule(MANGA_CHECKER_CONFIG.SCHEDULE, scheduledCheck, {
  scheduled: false,
  timezone: 'UTC',
});

export const start = () => {
  logger.info(LOG_MESSAGES.MANGA_CHECKER_JOB_STARTING);
  job.start();
};

export default {
  start,
  job,
};
 