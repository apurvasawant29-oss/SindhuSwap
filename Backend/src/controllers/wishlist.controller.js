const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } = require("../constants");
const { formatProduct } = require("../utils/modelFormatter");

const productPopulate = {
  path: "product",
  populate: { path: "owner", select: "fullName email phone avatar role status taluka createdAt" },
};

const listWishlist = asyncHandler(async (req, res) => {
  const items = await Wishlist.find({ user: req.user._id }).populate(productPopulate).sort("-createdAt");
  const products = items.filter((item) => item.product).map((item) => ({
    id: item._id.toString(),
    wishlistId: item._id.toString(),
    product: formatProduct(item.product),
    ...formatProduct(item.product),
  }));

  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.FETCHED, {
    items: products,
    count: products.length,
  });
});

const addWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
  }

  const item = await Wishlist.findOneAndUpdate(
    { user: req.user._id, product: product._id },
    { user: req.user._id, product: product._id },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  ).populate(productPopulate);

  await Notification.create({
    user: req.user._id,
    title: "Wishlist Updated",
    message: `${product.title} was added to your wishlist.`,
    type: "wishlist",
  });

  return sendSuccess(res, HTTP_STATUS.CREATED, "Added to wishlist", {
    item: { id: item._id.toString(), product: formatProduct(item.product) },
  });
});

const removeWishlist = asyncHandler(async (req, res) => {
  const item = await Wishlist.findOneAndDelete({ user: req.user._id, product: req.params.productId }).populate("product");
  if (item?.product) {
    await Notification.create({
      user: req.user._id,
      title: "Wishlist Updated",
      message: `${item.product.title} was removed from your wishlist.`,
      type: "wishlist",
    });
  }
  return sendSuccess(res, HTTP_STATUS.OK, "Removed from wishlist");
});

module.exports = {
  listWishlist,
  addWishlist,
  removeWishlist,
};
