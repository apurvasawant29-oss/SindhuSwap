const productService = require("../services/product.service");
const { HTTP_STATUS, SUCCESS_MESSAGES } = require("../constants");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const listProducts = asyncHandler(async (req, res) => {
  const data = await productService.listProducts(req.query);
  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.FETCHED, data);
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProduct(req.params.id);
  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.FETCHED, { product });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct({
    body: req.body,
    files: req.files,
    user: req.user,
  });
  return sendSuccess(res, HTTP_STATUS.CREATED, SUCCESS_MESSAGES.CREATED, { product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct({
    id: req.params.id,
    body: req.body,
    files: req.files,
    user: req.user,
  });
  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.UPDATED, { product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct({ id: req.params.id, user: req.user });
  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.DELETED);
});

const myProducts = asyncHandler(async (req, res) => {
  const data = await productService.listMyProducts(req.user, req.query);
  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.FETCHED, data);
});

const requestSwap = asyncHandler(async (req, res) => {
  const swapRequest = await productService.requestSwap({
    productId: req.params.id,
    user: req.user,
    message: req.body.message,
    offeredProduct: req.body.offeredProduct,
  });
  return sendSuccess(res, HTTP_STATUS.CREATED, "Swap request submitted successfully", { swapRequest });
});

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  myProducts,
  requestSwap,
};
