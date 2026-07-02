const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { HTTP_STATUS } = require("../constants");
const ApiError = require("../utils/ApiError");

const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort("-createdAt")
    .limit(20);

  const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

  return sendSuccess(res, HTTP_STATUS.OK, "Notifications fetched", {
    notifications,
    unreadCount
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Notification not found");
  }

  return sendSuccess(res, HTTP_STATUS.OK, "Marked as read", { notification });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  return sendSuccess(res, HTTP_STATUS.OK, "All notifications marked as read");
});

const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!notification) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Notification not found");
  }
  return sendSuccess(res, HTTP_STATUS.OK, "Notification deleted");
});

module.exports = {
  listNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
