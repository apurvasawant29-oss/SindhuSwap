const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { HTTP_STATUS } = require("../constants");
const ApiError = require("../utils/ApiError");
const { formatProduct, formatUser } = require("../utils/modelFormatter");

const conversationPopulate = [
  { path: "participants", select: "fullName email phone avatar role status taluka createdAt" },
  { path: "product", populate: { path: "owner", select: "fullName email phone avatar role status taluka createdAt" } },
];

const formatMessage = (message, userId) => ({
  id: message._id.toString(),
  _id: message._id.toString(),
  conversation: message.conversation?.toString(),
  senderId: message.sender?._id?.toString() || message.sender?.toString(),
  receiverId: message.receiver?._id?.toString() || message.receiver?.toString(),
  sender: (message.sender?._id?.toString() || message.sender?.toString()) === userId.toString() ? "me" : "them",
  content: message.content,
  text: message.content,
  read: message.read,
  createdAt: message.createdAt,
});

const formatConversation = async (conversation, userId) => {
  const source = conversation.toObject ? conversation.toObject() : conversation;
  const otherUser = source.participants.find((participant) => participant._id.toString() !== userId.toString());
  const unread = await Message.countDocuments({
    conversation: source._id,
    receiver: userId,
    read: false,
  });
  const product = formatProduct(source.product);
  const other = formatUser(otherUser);

  return {
    id: source._id.toString(),
    _id: source._id.toString(),
    participant: other,
    name: other?.name || "SindhuSwap User",
    avatar: other?.profileImage || other?.avatar || "",
    isOnline: false,
    lastSeen: source.lastMessageAt ? new Date(source.lastMessageAt).toLocaleString() : "Offline",
    unreadCount: unread,
    productName: product?.name || "Product",
    productImage: product?.image || "",
    product: product ? { ...product, owner: product.seller, swapStatus: "Pending" } : null,
    lastMessage: source.lastMessage,
    updatedAt: source.lastMessageAt || source.updatedAt,
    messages: [],
  };
};

const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate(conversationPopulate)
    .sort("-lastMessageAt");

  const formatted = await Promise.all(conversations.map((conversation) => formatConversation(conversation, req.user._id)));
  return sendSuccess(res, HTTP_STATUS.OK, "Conversations fetched", { conversations: formatted, contacts: formatted });
});

const startConversation = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Product is required to start chat");
  }

  const product = await Product.findById(productId).populate("owner", "fullName email phone avatar role status taluka createdAt");
  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Product not found");
  }

  if (product.owner._id.toString() === req.user._id.toString()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "You cannot chat with yourself for your own product");
  }

  const participants = [req.user._id, product.owner._id].sort();
  let conversation = await Conversation.findOne({
    product: product._id,
    participants: { $all: participants, $size: 2 },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants,
      product: product._id,
      lastMessage: `Conversation started for ${product.title}`,
    });

    await Notification.create({
      user: product.owner._id,
      title: "New Chat Started",
      message: `${req.user.fullName} started a chat about ${product.title}.`,
      type: "message",
    });
  }

  await conversation.populate(conversationPopulate);
  return sendSuccess(res, HTTP_STATUS.OK, "Conversation ready", {
    conversation: await formatConversation(conversation, req.user._id),
  });
});

const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.user._id,
  });

  if (!conversation) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Conversation not found");
  }

  const messages = await Message.find({ conversation: conversation._id }).sort("createdAt");

  await Message.updateMany(
    { conversation: conversation._id, receiver: req.user._id, read: false },
    { read: true }
  );

  return sendSuccess(res, HTTP_STATUS.OK, "Messages fetched", {
    messages: messages.map((message) => formatMessage(message, req.user._id)),
  });
});

const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, content } = req.body;

  if (!conversationId || !content?.trim()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Conversation and content are required");
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.user._id,
  });

  if (!conversation) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Conversation not found");
  }

  const receiver = conversation.participants.find((participant) => participant.toString() !== req.user._id.toString());
  const message = await Message.create({
    sender: req.user._id,
    receiver,
    conversation: conversation._id,
    product: conversation.product,
    content: content.trim(),
  });

  conversation.lastMessage = message.content;
  conversation.lastMessageAt = message.createdAt;
  await conversation.save();

  await Notification.create({
    user: receiver,
    title: "New Message Received",
    message: `${req.user.fullName}: ${message.content}`,
    type: "message",
  });

  return sendSuccess(res, HTTP_STATUS.CREATED, "Message sent", {
    message: formatMessage(message, req.user._id),
  });
});

const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findOneAndDelete({
    _id: req.params.id,
    $or: [{ sender: req.user._id }, { receiver: req.user._id }],
  });

  if (!message) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Message not found or unauthorized");
  }

  return sendSuccess(res, HTTP_STATUS.OK, "Message deleted");
});

module.exports = {
  getConversations,
  startConversation,
  getContacts: getConversations,
  getMessages,
  sendMessage,
  deleteMessage,
};
