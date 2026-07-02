const express = require("express");
const adminController = require("../controllers/admin.controller");
const productController = require("../controllers/product.controller");
const { adminOnly } = require("../middlewares/admin.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { HTTP_STATUS } = require("../constants");
const { sendSuccess } = require("../utils/apiResponse");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/health", (_req, res) =>
  sendSuccess(res, HTTP_STATUS.OK, "Admin API is ready")
);
router.get("/dashboard", adminController.dashboard);
router.get("/users", adminController.listUsers);
router.patch("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
router.get("/products", productController.listProducts);
router.patch("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);
router.get("/reviews", adminController.listReviews);
router.patch("/reviews/:id", adminController.updateReview);
router.delete("/reviews/:id", adminController.deleteReview);
router.get("/reports", adminController.listReports);
router.patch("/reports/:id", adminController.updateReport);
router.delete("/reports/:id", adminController.deleteReport);
router.get("/swaps", adminController.listSwaps);
router.patch("/swaps/:id", adminController.updateSwap);
router.delete("/swaps/:id", adminController.deleteSwap);
router.get("/notifications", adminController.listNotifications);
router.patch("/notifications/:id", adminController.updateNotification);
router.delete("/notifications/:id", adminController.deleteNotification);
router.get("/wishlist", adminController.listWishlist);

module.exports = router;
