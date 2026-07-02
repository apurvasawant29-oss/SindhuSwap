const express = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const adminRoutes = require("./admin.routes");
const productRoutes = require("./product.routes");
const wishlistRoutes = require("./wishlist.routes");
const contactRoutes = require("./contact.routes");
const categoryRoutes = require("./category.routes");
const { HTTP_STATUS, SUCCESS_MESSAGES } = require("../constants");
const { sendSuccess } = require("../utils/apiResponse");

const router = express.Router();

router.get("/health", (_req, res) =>
  sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.HEALTH_OK)
);

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/products", productRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/contact", contactRoutes);
router.use("/categories", categoryRoutes);

module.exports = router;
