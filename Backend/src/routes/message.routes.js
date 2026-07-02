const express = require("express");
const { 
  getContacts, 
  getMessages, 
  sendMessage, 
  deleteMessage 
} = require("../controllers/message.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.get("/contacts", getContacts);
router.get("/:contactId", getMessages);
router.post("/", sendMessage);
router.delete("/:id", deleteMessage);

module.exports = router;
