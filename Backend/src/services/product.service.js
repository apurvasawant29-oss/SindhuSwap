const Product = require("../models/Product");
const Wishlist = require("../models/Wishlist");
const SwapRequest = require("../models/SwapRequest");
const ApiError = require("../utils/ApiError");
const { ERROR_MESSAGES, HTTP_STATUS, ROLES } = require("../constants");
const { getPagination, formatPagination } = require("../utils/pagination");
const { formatProduct } = require("../utils/modelFormatter");

const productPopulate = { path: "owner", select: "fullName email phone avatar role status taluka createdAt" };

const buildFilter = (query = {}) => {
  const filter = {};

  if (query.category) filter.category = query.category;
  if (query.taluka || query.location) filter.taluka = query.taluka || query.location;
  if (query.condition) filter.condition = query.condition;
  if (query.status) filter.status = query.status;
  if (query.productType) filter.productType = query.productType;
  if (query.owner) filter.owner = query.owner;

  const search = query.search || query.q;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { taluka: { $regex: search, $options: "i" } },
    ];
  }

  return filter;
};

const listProducts = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = buildFilter(query);
  const sort = query.sort || "-createdAt";

  const [items, total] = await Promise.all([
    Product.find(filter).populate(productPopulate).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    products: items.map(formatProduct),
    pagination: formatPagination({ page, limit, total }),
  };
};

const getProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { returnDocument: "after" }
  ).populate(productPopulate);

  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
  }

  return formatProduct(product);
};

const createProduct = async ({ body, files = [], user }) => {
  const images = files.map((file) => ({
    url: `/uploads/products/${file.filename}`,
    filename: file.filename,
  }));

  const product = await Product.create({
    title: body.title || body.name,
    description: body.description,
    category: body.category,
    condition: body.condition,
    images,
    district: body.district || "Sindhudurg",
    taluka: body.taluka || body.location,
    address: body.address,
    productType: body.productType || body.priceType || "Sale",
    exchangePreference: body.exchangePreference,
    price: Number(body.price || 0),
    status: body.status || "Available",
    owner: user._id,
  });

  await product.populate(productPopulate);
  return formatProduct(product);
};

const ensureOwnerOrAdmin = (product, user) => {
  const ownerId = product.owner?._id?.toString() || product.owner?.toString();
  if (ownerId !== user._id.toString() && user.role !== ROLES.ADMIN) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.NOT_OWNER);
  }
};

const updateProduct = async ({ id, body, files = [], user }) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
  }

  ensureOwnerOrAdmin(product, user);

  const allowed = [
    "title",
    "description",
    "category",
    "condition",
    "district",
    "taluka",
    "address",
    "productType",
    "exchangePreference",
    "price",
    "status",
  ];

  allowed.forEach((field) => {
    if (body[field] !== undefined) product[field] = body[field];
  });

  if (body.name && !body.title) product.title = body.name;
  if (body.location && !body.taluka) product.taluka = body.location;
  if (body.priceType && !body.productType) product.productType = body.priceType;
  if (body.price !== undefined) product.price = Number(body.price || 0);

  if (files.length) {
    product.images = files.map((file) => ({
      url: `/uploads/products/${file.filename}`,
      filename: file.filename,
    }));
  }

  await product.save();
  await product.populate(productPopulate);
  return formatProduct(product);
};

const deleteProduct = async ({ id, user }) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
  }

  ensureOwnerOrAdmin(product, user);
  await Wishlist.deleteMany({ product: product._id });
  await SwapRequest.deleteMany({ product: product._id });
  await product.deleteOne();
};

const listMyProducts = async (user, query) => {
  return listProducts({ ...query, owner: user._id });
};

const requestSwap = async ({ productId, user, message, offeredProduct }) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
  }

  if (product.owner.toString() === user._id.toString()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "You cannot request a swap for your own product");
  }

  const request = await SwapRequest.create({
    product: product._id,
    owner: product.owner,
    requester: user._id,
    offeredProduct,
    message,
  });

  return request;
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listMyProducts,
  requestSwap,
};
