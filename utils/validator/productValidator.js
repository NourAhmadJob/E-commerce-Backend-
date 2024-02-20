const { check , body } = require("express-validator");
const validatorMiddleware = require("./../../middleware/validatorMiddleware");
const Category = require("./../../models/categoryModel");
const SubCategory = require("./../../models/subCategoryModel");

exports.createProductValidator = [
  check('title')
    .notEmpty()
    .withMessage("Title prodcut must be required")
    .isLength({ min: 3 })
    .withMessage("To short title"),
  check("description")
    .notEmpty()
    .withMessage("Description prodcut must be required")
    .isLength({ max: 2000 })
    .withMessage("To long description"),
  check("slug").notEmpty().withMessage("Slug prodcut must be required"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Price prodcut must be required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 30000 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be a lower than price");
      }
      return true;
    }),
  check("color")
    .optional()
    .isArray()
    .withMessage("color should be array of string"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity prodcut must be required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`Can't find this categoryId : ${categoryId}`)
          );
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((subcategoryId) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoryId } }).then(
        (result) => {
          if ((result.length < 1) | (result.length != subcategoryId.length)) {
            return Promise.reject(
              new Error(
                "Invalid Subcategory ID , please check your SubcategoryId .... "
              )
            );
          }
        }
      )
    )
    .custom((subcategoryId, { req }) =>
      SubCategory.find({
        category: req.body.category,
      }).then((subcategories) => {
        const subCategoriesIdInDB = [];
        subcategories.forEach((subcategory) => {
          subCategoriesIdInDB.push(subcategory._id.toString());
        });
        const checker = (target, arr) => target.every((v) => arr.includes(v));
        if (!subcategoryId.every((v) => subCategoriesIdInDB.includes(v))) {
          return Promise.reject(
            new Error("subcategories not belong to category")
          );
        }
      })
    ),
  check("imageCover")
    .notEmpty()
    .withMessage("ImageCover prodcut must be required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Images should be array of string"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product ratingAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratingQuantity must be a number"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];
