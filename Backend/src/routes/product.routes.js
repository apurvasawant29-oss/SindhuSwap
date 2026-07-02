const express = require("express");
const productController = require("../controllers/product.controller");
const { protect } = require("../middlewares/auth.middleware");
const { uploadProductImages } = require("../middlewares/upload.middleware");
const { productValidator } = require("../validators/product.validator");

const router = express.Router();

router.get("/", productController.listProducts);
router.get("/mine", protect, productController.myProducts);
router.post("/", protect, uploadProductImages, productValidator, productController.createProduct);
router.get("/:id", productController.getProduct);
router.put("/:id", protect, uploadProductImages, productValidator, productController.updateProduct);
router.delete("/:id", protect, productController.deleteProduct);
router.post("/:id/swap-requests", protect, productController.requestSwap);

module.exports = router;
