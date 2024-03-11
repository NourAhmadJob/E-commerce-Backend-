const asynchandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Cart = require("./../models/cartModel");
const Product = require("./../models/productsModel");
const Coupon = require("./../models/couponModel");

caluculatePrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalCartPriceAfterDiscount = undefined;
  return totalPrice;
};m

exports.AddProductToCart = asynchandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  // check if cart is exist
  let cart = await Cart.findOne({ user: req.user._id });
  // if not cart exist  => create a new cart and add the product
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          productId,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    // if product exist in cart , update product quantity
    const productExist = cart.cartItems.findIndex(
      (item) => item.productId.toString() === productId && item.color === color
    );
    if (productExist > -1) {
      const cartItem = cart.cartItems[productExist];
      cartItem.quantity += 1;

      cart.cartItems[productExist] = cartItem;
    }
    // if product not exist in cart , push product to caritems array
    else {
      cart.cartItems.push({
        productId,
        color,
        price: product.price,
      });
    }
  }
  caluculatePrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    message: "Added product to cart successfully",
    data: cart,
  });
});

exports.getLoggedUserCart = asynchandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this userId : ${req.user._id} `, 404)
    );
  }
  res.status(200).json({
    status: "success",
    nemberOfCart: cart.cartItems.length,
    data: cart,
  });
});

exports.removeSpecificCartItem = asynchandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );
  caluculatePrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numberOfItems: cart.cartItems.length,
    data: cart,
  });
});

exports.removeAllCartItem = asynchandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

exports.updateQuantityCartItem = asynchandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`not found cart with user id ${req.user._id}`, 404)
    );
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(new ApiError(`not found itemCart with cart id`, 404));
  }
  caluculatePrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    message: "update quantity cart",
    data: cart,
  });
});

exports.applyCoupon = asynchandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("Coupon invalid or expired date"));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  const totalPrice = cart.totalCartPrice;
  const priceDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalCartPriceAfterDiscount = priceDiscount;
  await cart.save();
  res.status(200).json({
    status: "success",
    message: "Updated cart price and add discount price to cart",
    data: cart,
  });
});
