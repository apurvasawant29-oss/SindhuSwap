const express = require("express");
const contactController = require("../controllers/contact.controller");
const { adminOnly } = require("../middlewares/admin.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { contactValidator } = require("../validators/contact.validator");

const router = express.Router();

router.post("/", contactValidator, contactController.createMessage);
router.get("/", protect, adminOnly, contactController.listMessages);
router.patch("/:id/read", protect, adminOnly, contactController.markRead);
router.delete("/:id", protect, adminOnly, contactController.deleteMessage);

module.exports = router;
