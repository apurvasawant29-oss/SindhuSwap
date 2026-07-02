const express = require("express");
const categoryController = require("../controllers/category.controller");
const { adminOnly } = require("../middlewares/admin.middleware");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", categoryController.listCategories);
router.post("/", protect, adminOnly, categoryController.createCategory);
router.put("/:id", protect, adminOnly, categoryController.updateCategory);
router.delete("/:id", protect, adminOnly, categoryController.deleteCategory);

module.exports = router;
