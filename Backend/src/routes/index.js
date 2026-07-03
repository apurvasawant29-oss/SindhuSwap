const express = require("express");
const swapRoutes = require("./swap.routes");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const adminRoutes = require("./admin.routes");
const productRoutes = require("./product.routes");
const wishlistRoutes = require("./wishlist.routes");
const contactRoutes = require("./contact.routes");
const categoryRoutes = require("./category.routes");
const notificationRoutes = require("./notification.routes");
const messageRoutes = require("./message.routes");
const { HTTP_STATUS, SUCCESS_MESSAGES } = require("../constants");
const { sendSuccess } = require("../utils/apiResponse");

const router = express.Router();

router.get("/health", (_req, res) =>
  sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.HEALTH_OK)
);

router.use("/swap", swapRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/products", productRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/contact", contactRoutes);
router.use("/categories", categoryRoutes);
router.use("/notifications", notificationRoutes);
router.use("/messages", messageRoutes);

module.exports = router;
