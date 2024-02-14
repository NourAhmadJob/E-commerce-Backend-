const { check } = require("express-validator");
const validatorMiddleware = require("./../../middleware/validatorMiddleware");
exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Id , please try again ... "),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Please enter category name")
    .isLength({ min: 3 })
    .withMessage("To short name ")
    .isLength({ max: 32 })
    .withMessage("To great the  name "),

  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Please enter CategoryId")
    .isMongoId()
    .withMessage("Invalid CategoryId"),
    validatorMiddleware
];
