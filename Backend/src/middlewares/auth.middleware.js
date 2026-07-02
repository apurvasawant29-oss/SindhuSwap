const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ERROR_MESSAGES, HTTP_STATUS, USER_STATUS } = require("../constants");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || "";

  if (typeof authHeader === "string" && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  return req.cookies?.token || req.headers["x-access-token"];
};

const protect = asyncHandler(async (req, _res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "sindhuswap-dev-secret");
    const user = await User.findById(decoded.id || decoded._id);

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.ACCOUNT_INACTIVE);
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error.name === "TokenExpiredError") {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_EXPIRED);
    }

    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
  }
});

module.exports = {
  protect,
};
