const express = require("express");
const { 
  getContacts, 
  getConversations,
  startConversation,
  getMessages, 
  sendMessage, 
  deleteMessage 
} = require("../controllers/message.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.get("/contacts", getContacts);
router.get("/conversations", getConversations);
router.post("/conversations", startConversation);
router.get("/conversations/:conversationId", getMessages);
router.post("/", sendMessage);
router.delete("/:id", deleteMessage);

module.exports = router;
