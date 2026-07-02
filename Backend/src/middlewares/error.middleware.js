const ApiError = require("../utils/ApiError");
const { sendError } = require("../utils/apiResponse");

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = err.errors || [];

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed.";
    errors = Object.values(err.errors).map((error) => error.message);
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate field value.";
    errors = Object.keys(err.keyValue || {}).map((key) => `${key} already exists.`);
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier.";
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  return sendError(res, statusCode, message, errors);
};

module.exports = {
  notFound,
  errorHandler,
};
