const { check } = require("express-validator");
const validatorMiddleware = require("./../../middleware/validatorMiddleware");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Please Enter Name for subCategory")
    .isLength({ min: 2 })
    .withMessage("To short your name subCategory"),
  check("category")
    .notEmpty()
    .withMessage("Category Id must be input field")
    .isMongoId()
    .withMessage("Invalid category ID format"),
  validatorMiddleware,
];


exports.getSubCategoryByIdValidator = [
  check('id').isMongoId().withMessage("Invalid Id in this MongoDB database"),
  validatorMiddleware
]; 

exports.updateSubCategoryValidator = [
  check('id').isMongoId().withMessage("Invalid SubCategory ID format"),
  validatorMiddleware
];

exports.deleteSubCategoryValidator = [
  check('id').isMongoId().withMessage("Invalid SubCategory ID format"),
  validatorMiddleware
];