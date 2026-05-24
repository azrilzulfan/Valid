const Notification = require('./notification.model');

const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification
      .find({ uid: req.user.uid })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      uid: req.user.uid,
      isRead: false
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    await Notification.updateOne(
      { notificationId, uid: req.user.uid },
      { isRead: true }
    );

    res.json({ message: 'Notifikasi ditandai sudah dibaca' });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { uid: req.user.uid, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'Semua notifikasi ditandai sudah dibaca' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead };