const ApiError = require("../utils/ApiError");

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema(req.body);

  if (error) {
    return next(new ApiError(400, "Validation failed.", error));
  }

  req.body = value;
  return next();
};

module.exports = validate;
