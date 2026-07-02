const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { HTTP_STATUS, SUCCESS_MESSAGES } = require("../constants");
const { sendSuccess } = require("../utils/apiResponse");

const router = express.Router();

router.get("/me", protect, (req, res) =>
  sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PROFILE_FETCHED, { user: req.user })
);

module.exports = router;
