const { body } = require("express-validator");
const validate = require("../middlewares/validate.middleware");

const productValidator = [
  body("title").optional().trim().isLength({ min: 2 }).withMessage("Product title is required"),
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Product title is required"),
  body().custom((value) => {
    if (!value.title && !value.name) {
      throw new Error("Product title is required");
    }
    if (!value.taluka && !value.location) {
      throw new Error("Taluka is required");
    }
    return true;
  }),
  body("description").trim().isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("condition").trim().notEmpty().withMessage("Condition is required"),
  body("taluka").optional().trim().notEmpty().withMessage("Taluka is required"),
  body("location").optional().trim().notEmpty().withMessage("Taluka is required"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  validate,
];

module.exports = {
  productValidator,
};
