import userService from '../services/userService.js';
import { NotFoundError } from '../utils/errors.js';
import { ERROR_MESSAGES, RESPONSE_MESSAGES } from '../config/common.js';

const getMe = async (req, res, next) => {
  try {
    const user = await userService.getUser(req.user.id);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { notificationSettings, ...otherUpdates } = req.body;
    const userId = req.user.id;
    let needsFinalFetch = false;

    if (notificationSettings && Object.keys(notificationSettings).length > 0) {
      await userService.updateNotificationSettings(userId, notificationSettings);
      needsFinalFetch = true;
    }

    if (Object.keys(otherUpdates).length > 0) {
      const origin = `${req.protocol}://${req.get('host')}`;
      await userService.updateUser({ ...otherUpdates, _id: userId }, req.user, origin);
      needsFinalFetch = true;
    }

    if (needsFinalFetch) {
      const user = await userService.getUser(userId);
      return res.status(200).json(user);
    }

    res.status(200).json({ message: 'No profile data was updated.' });
  } catch (err) {
    next(err);
  }
};

const deleteMe = async (req, res, next) => {
  try {
    await userService.deleteUser(req.user.id, req.user);
    res.status(200).json({ message: RESPONSE_MESSAGES.USER_SOFT_DELETED });
  } catch (err) {
    next(err);
  }
};

export default {
  getMe,
  updateMe,
  deleteMe,
}; 