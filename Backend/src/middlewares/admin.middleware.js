const { ERROR_MESSAGES, HTTP_STATUS, ROLES } = require("../constants");
const ApiError = require("../utils/ApiError");

const adminOnly = (req, _res, next) => {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    return next(new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN));
  }

  return next();
};

module.exports = {
  adminOnly,
};
