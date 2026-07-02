const Message = require("../models/Message");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { HTTP_STATUS } = require("../constants");
const ApiError = require("../utils/ApiError");

const getContacts = asyncHandler(async (req, res) => {
  // Get users the current user has messaged or received messages from
  const messages = await Message.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }]
  }).sort("-createdAt").populate("sender receiver", "name profileImage taluka");

  const contactsMap = new Map();
  messages.forEach(msg => {
    const contact = msg.sender._id.toString() === req.user._id.toString() ? msg.receiver : msg.sender;
    if (!contactsMap.has(contact._id.toString())) {
      contactsMap.set(contact._id.toString(), {
        _id: contact._id,
        name: contact.name,
        profileImage: contact.profileImage,
        taluka: contact.taluka,
        lastMessage: msg.content,
        updatedAt: msg.createdAt,
        unread: msg.receiver._id.toString() === req.user._id.toString() && !msg.read ? 1 : 0
      });
    } else {
      if (msg.receiver._id.toString() === req.user._id.toString() && !msg.read) {
        const c = contactsMap.get(contact._id.toString());
        c.unread += 1;
        contactsMap.set(contact._id.toString(), c);
      }
    }
  });

  return sendSuccess(res, HTTP_STATUS.OK, "Contacts fetched", { contacts: Array.from(contactsMap.values()) });
});

const getMessages = asyncHandler(async (req, res) => {
  const { contactId } = req.params;
  
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: contactId },
      { sender: contactId, receiver: req.user._id }
    ]
  }).sort("createdAt");

  // Mark as read
  await Message.updateMany(
    { sender: contactId, receiver: req.user._id, read: false },
    { read: true }
  );

  return sendSuccess(res, HTTP_STATUS.OK, "Messages fetched", { messages });
});

const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;
  
  if (!receiverId || !content) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Receiver and content are required");
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    content
  });

  return sendSuccess(res, HTTP_STATUS.CREATED, "Message sent", { message });
});

const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findOneAndDelete({
    _id: req.params.id,
    $or: [{ sender: req.user._id }, { receiver: req.user._id }]
  });

  if (!message) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Message not found or unauthorized");
  }

  return sendSuccess(res, HTTP_STATUS.OK, "Message deleted");
});

module.exports = {
  getContacts,
  getMessages,
  sendMessage,
  deleteMessage
};
