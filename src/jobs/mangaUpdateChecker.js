import cron from 'node-cron';
import logger from '../config/logger.js';
import trackedMangaRepository from '../repository/trackedMangaRepository.js';
import userRepository from '../repository/userRepository.js';
import { scrapeLatestMangaChapter } from '../services/scraperService.js';
import { sendLocalizedMail } from '../services/emailService.js';

const scheduledCheck = async () => {
  logger.info('Running scheduled job: Checking for manga updates...');

  const allTrackedManga = await trackedMangaRepository.getTrackedMangas();
  if (!allTrackedManga || allTrackedManga.length === 0) {
    logger.info('No tracked manga to check. Skipping job run.');
    return;
  }

  for (const manga of allTrackedManga) {
    if (!manga.notificationEnabled) {
      logger.info(`Skipping check for disabled notifications on: ${manga.mangaTitle}`);
      continue;
    }

    try {
      logger.info(`Checking for updates on: ${manga.mangaTitle} (${manga.url})`);
      const latestChapter = await scrapeLatestMangaChapter(manga.url);

      if (latestChapter && latestChapter.url !== manga.lastKnownChapterUrl) {
        logger.info(`New chapter found for ${manga.mangaTitle}: ${latestChapter.text}`);

        const user = await userRepository.getUser(manga.userId);
        if (user && user.email) {
          await sendLocalizedMail({
            to: user.email,
            subjectKey: 'newChapter',
            bodyKey: 'newChapter.body',
            data: {
              mangaTitle: manga.mangaTitle,
              chapterText: latestChapter.text,
              chapterUrl: latestChapter.url,
            },
            lang: user.language || 'en',
          });
          logger.info(`Notification sent to ${user.email} for ${manga.mangaTitle}`);
        }

        await trackedMangaRepository.updateTrackedManga(manga._id, {
          lastKnownChapter: latestChapter.text,
          lastKnownChapterUrl: latestChapter.url,
          lastUpdatedAt: new Date(),
        });
      }

      await trackedMangaRepository.updateTrackedManga(manga._id, { lastCheckedAt: new Date() });
    } catch (error) {
      logger.error(
        `Failed to check manga ${manga.mangaTitle} (${manga.url}):`,
        error
      );
    }
  }
  logger.info('Finished checking for manga updates.');
};

// Schedule to run every hour
const job = cron.schedule('0 * * * *', scheduledCheck, {
  scheduled: false,
  timezone: 'UTC',
});

export const start = () => {
  logger.info('Starting manga update checker cron job.');
  job.start();
  // For immediate check on startup, uncomment the line below
  // scheduledCheck();
};

export default {
  start,
  job,
}; 