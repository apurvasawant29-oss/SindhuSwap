const { validationResult } = require("express-validator");
const { ERROR_MESSAGES, HTTP_STATUS } = require("../constants");
const ApiError = require("../utils/ApiError");

const validate = (req, _res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));

  return next(
    new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_MESSAGES.VALIDATION_FAILED, errors)
  );
};

module.exports = validate;
