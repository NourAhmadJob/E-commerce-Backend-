const express = require("express");

const subCategoryRoute = express.Router();
const subCategoryController = require("./../controller/subCategoryController");
const {
  createSubCategoryValidator,
  getSubCategoryByIdValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("./../utils/validator/subCategoryValidator");

subCategoryRoute
  .route("/")
  .post(createSubCategoryValidator, subCategoryController.createSubCategory)
  .get(subCategoryController.getAllSubCategories);

subCategoryRoute
  .route("/:id")
  .get(getSubCategoryByIdValidator, subCategoryController.getSubCategoryById)
  .patch(updateSubCategoryValidator, subCategoryController.updateSubCategory)
  .delete(deleteSubCategoryValidator, subCategoryController.deleteSubCategory);

module.exports = subCategoryRoute;
