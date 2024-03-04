const express = require("express");
const categoryRoute = express.Router();
const categoryController = require("./../controller/categoryController");
const {
  getCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
} = require("./../utils/validator/categoryValidator");

const authController = require('./../controller/authController');

categoryRoute
  .route("/")
  .get(categoryController.getAllCategory)
  .post(
    authController.protect,
    authController.allowedTo('manager' , 'admin'),
    categoryController.uploadCategoryImage,
    categoryController.resizeImage,
    createCategoryValidator,
    categoryController.createCategory
  );

categoryRoute
  .route("/:id")
  .get(getCategoryValidator, categoryController.getCategoryById)
  .delete(deleteCategoryValidator, categoryController.deleteCategory);

module.exports = categoryRoute;
