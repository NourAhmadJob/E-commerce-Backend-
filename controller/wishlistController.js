const asynchandler = require("express-async-handler");

const User = require("./../models/userModels");

// Protected/User
exports.addProductToWishlist = asynchandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "Product added successfully to your wishlist",
    data: user.wishlist,
  });
});

exports.removeProductToWishlist = asynchandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product removed successfully from your wishlist",
    data: user.wishlist,
  });
});

exports.getLoggedUserWishlist = asynchandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({
        status: 'success',
        data: user.wishlist
    });
})
