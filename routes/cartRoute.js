const express = require("express");

const router = express.Router();

const authController = require("./../controller/authController");

const {
  AddProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  removeAllCartItem,
  updateQuantityCartItem,
  applyCoupon,
} = require("./../controller/cartController");

router.use(authController.protect, authController.allowedTo("user"));
router.put("/applyCoupon", applyCoupon);
router
  .route("/")
  .post(AddProductToCart)
  .get(getLoggedUserCart)
  .delete(removeAllCartItem);

router
  .route("/:itemId")
  .put(updateQuantityCartItem)
  .delete(removeSpecificCartItem);

module.exports = router;
