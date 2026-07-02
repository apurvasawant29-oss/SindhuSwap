const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Wishlist = require("../models/Wishlist");
const SwapRequest = require("../models/SwapRequest");
const ContactMessage = require("../models/ContactMessage");
const Notification = require("../models/Notification");
const Review = require("../models/Review");
const Report = require("../models/Report");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { HTTP_STATUS, SUCCESS_MESSAGES } = require("../constants");
const { formatProduct, formatUser } = require("../utils/modelFormatter");

const dashboard = asyncHandler(async (_req, res) => {
  const [
    totalUsers,
    totalProducts,
    activeSwaps,
    wishlistCount,
    totalCategories,
    contactMessages,
    newUsers,
    recentProducts,
  ] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    SwapRequest.countDocuments({ status: { $in: ["Pending", "Accepted"] } }),
    Wishlist.countDocuments(),
    Category.countDocuments(),
    ContactMessage.countDocuments(),
    User.find().sort("-createdAt").limit(5),
    Product.find().populate("owner", "fullName email phone avatar role status taluka createdAt").sort("-createdAt").limit(5),
  ]);

  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.FETCHED, {
    stats: {
      totalUsers,
      totalProducts,
      activeSwaps,
      wishlistCount,
      totalCategories,
      contactMessages,
      newUsers: newUsers.length,
    },
    recentUsers: newUsers.map(formatUser),
    recentProducts: recentProducts.map(formatProduct),
  });
});

const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort("-createdAt");
  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.FETCHED, { users: users.map(formatUser) });
});

const updateUser = asyncHandler(async (req, res) => {
  const statusMap = { Active: "ACTIVE", Suspended: "INACTIVE", Banned: "BLOCKED" };
  const roleMap = { User: "USER", Admin: "ADMIN", Moderator: "USER" };
  const update = {};
  if (req.body.status) update.status = statusMap[req.body.status] || req.body.status;
  if (req.body.role) update.role = roleMap[req.body.role] || req.body.role;
  const user = await User.findByIdAndUpdate(req.params.id, update, { returnDocument: "after" });
  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.UPDATED, { user: formatUser(user) });
});

const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.DELETED);
});

const listCollection = (Model, key, formatter = (item) => item) =>
  asyncHandler(async (_req, res) => {
    const items = await Model.find().sort("-createdAt");
    return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.FETCHED, {
      [key]: items.map(formatter),
    });
  });

const updateStatus = (Model, key) =>
  asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
    return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.UPDATED, { [key]: item });
  });

const deleteItem = (Model) =>
  asyncHandler(async (req, res) => {
    await Model.findByIdAndDelete(req.params.id);
    return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.DELETED);
  });

module.exports = {
  dashboard,
  listUsers,
  updateUser,
  deleteUser,
  listReviews: listCollection(Review, "reviews"),
  updateReview: updateStatus(Review, "review"),
  deleteReview: deleteItem(Review),
  listReports: listCollection(Report, "reports"),
  updateReport: updateStatus(Report, "report"),
  deleteReport: deleteItem(Report),
  listSwaps: listCollection(SwapRequest, "swaps"),
  updateSwap: updateStatus(SwapRequest, "swap"),
  deleteSwap: deleteItem(SwapRequest),
  listNotifications: listCollection(Notification, "notifications"),
  updateNotification: updateStatus(Notification, "notification"),
  deleteNotification: deleteItem(Notification),
  listWishlist: listCollection(Wishlist, "wishlist"),
};
