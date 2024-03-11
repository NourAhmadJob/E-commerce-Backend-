const express = require("express");
const authController = require("./../controller/authController");
const wishlistRoute = express.Router();
const {
  addProductToWishlist,
  removeProductToWishlist,
  getLoggedUserWishlist,
} = require("./../controller/wishlistController");

wishlistRoute.use(authController.protect, authController.allowedTo("user"));

wishlistRoute.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);

wishlistRoute.delete("/:productId", removeProductToWishlist);

module.exports = wishlistRoute;
