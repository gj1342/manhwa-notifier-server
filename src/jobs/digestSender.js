import cron from 'node-cron';
import logger from '../config/logger.js';
import notificationQueueRepository from '../repository/notificationQueueRepository.js';
import { sendLocalizedMail } from '../services/emailService.js';
import { format } from 'util';
import { LOG_MESSAGES, DIGEST_CONFIG } from '../config/common.js';

const processDigest = async (frequency) => {
  logger.info(format(LOG_MESSAGES.DIGEST_JOB_START, frequency));
  const pending = await notificationQueueRepository.getPendingNotifications(frequency);

  if (!pending || pending.length === 0) {
    logger.info(format(LOG_MESSAGES.DIGEST_JOB_NO_NOTIFICATIONS, frequency));
    return;
  }

  const notificationsByUser = pending.reduce((acc, notification) => {
    const userId = notification.userId._id.toString();
    if (!acc[userId]) {
      acc[userId] = {
        email: notification.userId.email,
        lang: notification.userId.language || 'en',
        updates: [],
      };
    }
    acc[userId].updates.push(notification);
    return acc;
  }, {});

  for (const userId in notificationsByUser) {
    const userData = notificationsByUser[userId];
    try {
      await sendLocalizedMail({
        to: userData.email,
        subjectKey: format(DIGEST_CONFIG.EMAIL_SUBJECT_KEY, frequency),
        bodyKey: format(DIGEST_CONFIG.EMAIL_BODY_KEY, frequency),
        data: {
          updates: userData.updates,
          count: userData.updates.length,
        },
        lang: userData.lang,
      });

      const notificationIds = userData.updates.map((n) => n._id);
      await notificationQueueRepository.updateNotificationStatus(
        notificationIds,
        DIGEST_CONFIG.STATUS_SENT
      );
      logger.info(
        format(LOG_MESSAGES.DIGEST_JOB_SUCCESS, frequency, userData.email, userData.updates.length)
      );
    } catch (error) {
      logger.error(
        format(LOG_MESSAGES.DIGEST_JOB_FAILURE, frequency, userData.email),
        error
      );
    }
  }
};

const dailyDigestJob = cron.schedule(
  DIGEST_CONFIG.DAILY_SCHEDULE,
  () => processDigest(DIGEST_CONFIG.FREQUENCY_DAILY),
  {
    scheduled: false,
    timezone: 'UTC',
  }
);

const weeklyDigestJob = cron.schedule(
  DIGEST_CONFIG.WEEKLY_SCHEDULE,
  () => processDigest(DIGEST_CONFIG.FREQUENCY_WEEKLY),
  {
    scheduled: false,
    timezone: 'UTC',
  }
);

export const start = () => {
  logger.info(LOG_MESSAGES.DIGEST_JOBS_STARTING);
  dailyDigestJob.start();
  weeklyDigestJob.start();
};

export default {
  start,
}; 