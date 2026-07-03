const User = require("../models/User");
const Notification = require("../models/Notification");
const { ERROR_MESSAGES, HTTP_STATUS, ROLES, USER_STATUS } = require("../constants");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

const buildAuthPayload = (user) => ({
  user: user.toJSON(),
  token: generateToken({ id: user._id, role: user.role }),
});

const getDefaultAdminCredentials = () => ({
  fullName: process.env.DEFAULT_ADMIN_USERNAME || "admin",
  email: (process.env.DEFAULT_ADMIN_EMAIL || "admin@sindhuswap.com").toLowerCase(),
  password: process.env.DEFAULT_ADMIN_PASSWORD || "admin12345",
});

const ensureDefaultAdmin = async () => {
  const adminCredentials = getDefaultAdminCredentials();
  let admin = await User.findOne({ role: ROLES.ADMIN });

  if (!admin) {
    admin = await User.create({
      ...adminCredentials,
      phone: "",
      taluka: "",
      role: ROLES.ADMIN,
      status: USER_STATUS.ACTIVE,
      isVerified: true,
    });
  } else {
    admin.fullName = adminCredentials.fullName;
    admin.email = adminCredentials.email;
    admin.password = adminCredentials.password;
    admin.role = ROLES.ADMIN;
    admin.status = USER_STATUS.ACTIVE;
    admin.isVerified = true;
    await admin.save();
  }

  return admin;
};

const register = async ({ fullName, email, phone, password, taluka }) => {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.EMAIL_EXISTS);
  }

  const user = await User.create({
    fullName,
    email: normalizedEmail,
    phone,
    password,
    taluka,
  });

  await Notification.create({
    user: user._id,
    title: "Account Created",
    message: "Welcome to SindhuSwap. Your account is ready.",
    type: "system",
  });

  return buildAuthPayload(user);
};

const login = async ({ email, password, username }) => {
  const identifier = (email || username || "").toString().trim().toLowerCase();

  if (!identifier || !password) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const user = await User.findOne({
    $or: [{ email: identifier }, { fullName: identifier }],
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.ACCOUNT_INACTIVE);
  }

  return buildAuthPayload(user);
};

const adminLogin = async ({ email, password, username }) => {
  const auth = await login({ email, password, username });

  if (auth.user.role !== ROLES.ADMIN) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_ADMIN_CREDENTIALS);
  }

  return auth;
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return user;
};

module.exports = {
  register,
  login,
  adminLogin,
  getProfile,
  ensureDefaultAdmin,
};
