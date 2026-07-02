const ContactMessage = require("../models/ContactMessage");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { HTTP_STATUS, SUCCESS_MESSAGES } = require("../constants");

const createMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create(req.body);
  return sendSuccess(res, HTTP_STATUS.CREATED, "Message sent successfully", { message });
});

const listMessages = asyncHandler(async (_req, res) => {
  const messages = await ContactMessage.find().sort("-createdAt");
  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.FETCHED, { messages });
});

const markRead = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status: "Read" },
    { returnDocument: "after" }
  );
  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.UPDATED, { message });
});

const deleteMessage = asyncHandler(async (req, res) => {
  await ContactMessage.findByIdAndDelete(req.params.id);
  return sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.DELETED);
});

module.exports = {
  createMessage,
  listMessages,
  markRead,
  deleteMessage,
};
