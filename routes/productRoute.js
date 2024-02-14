const express = require("express");
const productController = require("./../controller/productController");
const productRoute = express.Router();
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("./../utils/validator/productValidator");

productRoute
  .route("/")
  .post(createProductValidator, productController.createProduct)
  .get(productController.getAllProduct);

productRoute
  .route("/:id")
  .get(getProductValidator, productController.getProductById)
  .put(updateProductValidator, productController.updateProduct)
  .delete(deleteProductValidator, productController.deleteProduct);
module.exports = productRoute;
