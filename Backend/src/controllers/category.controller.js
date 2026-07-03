const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { HTTP_STATUS, SUCCESS_MESSAGES } = require("../constants");
const slugGenerator = require("../utils/slugGenerator");

const defaultCategories = [
  "Mobiles",
  "Laptops",
  "Furniture",
  "Books",
  "Electronics",
  "Fashion",
  "Sports",
  "Vehicles",
  "Others",
];

const ensureDefaults = async () => {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(defaultCategories.map((name) => ({ name })));
  }
};

const listCategories = asyncHandler(async (_req, res) => {
  await ensureDefaults();
  const categories = await Category.find().sort("name");
  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.FETCHED, { categories });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  return sendSuccess(res, HTTP_STATUS.CREATED, SUCCESS_MESSAGES.CREATED, { category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const update = { ...req.body };
  if (update.name) {
    update.slug = slugGenerator(update.name);
  }
  const category = await Category.findByIdAndUpdate(req.params.id, update, { returnDocument: "after" });
  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.UPDATED, { category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.DELETED);
});

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
