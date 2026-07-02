const express = require("express");
const authController = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const {
  adminLoginValidator,
  loginValidator,
  registerValidator,
} = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", registerValidator, authController.register);
router.post("/login", loginValidator, authController.login);
router.post("/admin/login", adminLoginValidator, authController.adminLogin);
router.post("/logout", authController.logout);
router.get("/me", protect, authController.me);

module.exports = router;
