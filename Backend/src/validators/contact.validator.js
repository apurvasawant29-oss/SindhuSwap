const { body } = require("express-validator");
const validate = require("../middlewares/validate.middleware");

const contactValidator = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("subject").trim().isLength({ min: 3 }).withMessage("Subject is required"),
  body("message").trim().isLength({ min: 10 }).withMessage("Message must be at least 10 characters"),
  body("category").optional().trim(),
  validate,
];

module.exports = {
  contactValidator,
};
