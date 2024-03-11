const asynchandler = require("express-async-handler");

const User = require("./../models/userModels");

// Protected/User
exports.addAddress = asynchandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { address: req.body },
    },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "Added address successfully ",
    data: user.address,
  });
});

// Protected/User
exports.removeAddress = asynchandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { address: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Removed Address successfully",
    data: user.address,
  });
});

exports.getLoggedUserAddress = asynchandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("address");
  res.status(200).json({
    status: "success",
    data: user.address,
  });
});
