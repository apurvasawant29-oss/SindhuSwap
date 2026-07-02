const express = require("express");
const wishlistController = require("../controllers/wishlist.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);
router.get("/", wishlistController.listWishlist);
router.post("/:productId", wishlistController.addWishlist);
router.delete("/:productId", wishlistController.removeWishlist);

module.exports = router;
