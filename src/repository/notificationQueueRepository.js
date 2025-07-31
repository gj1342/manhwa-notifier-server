import NotificationQueue from '../models/NotificationQueue.js';
import User from '../models/User.js';

const createNotification = (data) => NotificationQueue.create(data);

const getPendingNotifications = async (frequency) => {
  // Step 1: Find all users who are subscribed to this digest frequency and have emails enabled.
  const users = await User.find(
    {
      'notificationSettings.frequency': frequency,
      'notificationSettings.emailEnabled': true,
    },
    '_id'
  ).lean();

  if (!users.length) {
    return [];
  }

  const userIds = users.map((user) => user._id);

  // Step 2: Find all pending notifications for that specific set of users.
  return NotificationQueue.find({
    userId: { $in: userIds },
    status: 'pending',
  }).populate('userId', 'email language');
};

const updateNotificationStatus = (ids, status) => {
  return NotificationQueue.updateMany({ _id: { $in: ids } }, { $set: { status, processedAt: new Date() } });
};

export default {
  createNotification,
  getPendingNotifications,
  updateNotificationStatus,
}; 