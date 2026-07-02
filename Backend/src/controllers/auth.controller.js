const authService = require("../services/auth.service");
const { HTTP_STATUS, SUCCESS_MESSAGES } = require("../constants");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const setTokenCookie = (res, token) => {
  res.cookie("token", token, cookieOptions);
};

const register = asyncHandler(async (req, res) => {
  const auth = await authService.register(req.body);
  setTokenCookie(res, auth.token);

  return sendSuccess(res, HTTP_STATUS.CREATED, SUCCESS_MESSAGES.REGISTERED, auth);
});

const login = asyncHandler(async (req, res) => {
  const auth = await authService.login(req.body);
  setTokenCookie(res, auth.token);

  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGIN_SUCCESS, auth);
});

const adminLogin = asyncHandler(async (req, res) => {
  const auth = await authService.adminLogin(req.body);
  setTokenCookie(res, auth.token);

  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGIN_SUCCESS, auth);
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("token", cookieOptions);

  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);

  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PROFILE_FETCHED, { user });
});

module.exports = {
  register,
  login,
  adminLogin,
  logout,
  me,
};
