const mongoose = require("mongoose");
const { ERROR_MESSAGES, HTTP_STATUS } = require("../constants");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

const notFound = (req, _res, next) => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `${ERROR_MESSAGES.ROUTE_NOT_FOUND}: ${req.originalUrl}`));
};

const normalizeError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));

    return new ApiError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.VALIDATION_FAILED, errors);
  }

  if (error instanceof mongoose.Error.CastError) {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, `Invalid ${error.path}`);
  }

  if (error.code === 11000) {
    return new ApiError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.EMAIL_EXISTS);
  }

  return new ApiError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.SERVER_ERROR,
    [],
    false
  );
};

const errorHandler = (error, _req, res, _next) => {
  const normalizedError = normalizeError(error);
  const statusCode = normalizedError.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  logger.error(normalizedError.message, {
    stack: error.stack,
    errors: normalizedError.errors,
  });

  const response = {
    success: false,
    message: normalizedError.message,
    errors: normalizedError.errors || [],
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler,
};
