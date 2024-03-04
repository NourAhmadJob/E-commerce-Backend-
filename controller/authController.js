// const {promisify} = require('util')
// const User = require('../models/userModels')
// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs');

// const handleError = (err) => {
//     console.log(err.message, err.code)
//     let errors = { email: '', password: '' }

//     // dublicate error
//     if (err.code === 11000) {
//         errors.email = 'This email is already registered'

//         return errors
//     }

//     // validation error
//     if (err.message.includes('user validation failed')) {
//         Object.values(err.errors).forEach(({properties}) => {
//             errors[properties.path] = properties.message;
//         })
//     }
//     return errors;
// }

// const sendToken =   (id) =>  {
//     const token =  jwt.sign({ id }, 'secret', { expiresIn: 90*60*60 })

//     return token;
// }

// exports.signup = async (req, res, next) => {
//     try {
//         const email = req.body.email;
//         const password = req.body.password;
//         const user = await User.create({ email, password })
//         const token = sendToken(user._id)
//         return res.status(201).json({
//             status: 'success',
//             token,
//             user,
//         })
//     } catch (err) {
//         const errors = handleError(err);
//         // console.log(err)
//         res.status(400).json({ errors })
//         next()
//     }
// }

// exports.login = async (req, res, next) => {
//     try {
//         const { email, password } = req.body
//         // check if user exist in database
//         const user = await User.findOne({ email })
//         if (!user) {
//             return res.status(401).json({
//                 status: 'fail',
//                 message : 'email not found',
//             })
//         }
//         // check if password is correct
//         const correct = await bcrypt.compare(password , user.password)
//         if (!correct) {
//             return res.status(401).json({
//                 status: 'fail',
//                 messsage : 'password is not correct , please try again ...',
//             })
//         }
//         const day = 3 * 24 * 60 * 60
//         const token =  sendToken(user._id)
//         return res.status(200).json({
//             status: 'success',
//             message: 'logged in successfully',
//             token,
//             user,
//         })
//         // res.send('some data')
//         // Ge}nerate token  and send it
//     } catch (err) {
//         console.log(err);
//         next();
//     }
// }

// exports.getAllUser = async (req, res, next) => {
//     try {
//         const users = await User.find();

//          res.status(200).json({
//             status: 'success',
//             message : "get all users successfully",
//             result: users.length,
//             users
//         })
//     } catch (err) {
//          res.status(400).json({
//             status: 'fail',
//             message : 'Error getting users'
//         })

//         next();
//     }
// }

// exports.protects = async (req, res, next) => {
//     try {
//         let token;
//         // Geting token and checking if it's there
//         if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//                 token =  req.headers.authorization.split(' ')[1]
//         }
//         if (!token) {
//              return res.status(401).json({
//                 status: 'Not authorized',
//                 message : 'You must be logged in to access this'
//             })
//         }

//         // Verification token
//         const decoded = await promisify(jwt.verify)(token, 'secret')
//         console.log(decoded);

//         // Checking if user is still exist
//         const freshUser = await User.findById(decoded.id)

//         if (!freshUser) {
//             res.status(401).json({
//                 status: 'fail',
//                 message : 'The user belonging to this token does not longer exist'
//             })
//             next();
//         }
//         // Check if user changed password after the token was issued

//         next()
//     } catch (err) {
//         console.log(err)
//         if (err.name === 'JsonWebTokenError') res.status(401).json({
//             status: 'fail',
//             message : 'Invalid token , Please Login again ... '
//         })

//         if (err.name === 'TokenExpiredError') res.status(401).json({
//             status: 'fail',
//             message : 'Your token has expired , Please Login again ... '
//         })
//             next();
//      }
// }

// exports.restrictTo = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes('admin' - 'lead-guide')) {
//             res.status(403).json({
//                 status: "fail",
//                 message : "You don't have permission to perform this action"
//             })
//             next();
//         }

//     }
// }

// exports.forgotPassword = (req, res, next) => { }
// exports.resetPassword = (req, res, next) => { }
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/apiError");
const User = require("./../models/userModels");
const sendEmail = require("./../utils/email");

const sendToken = (Id) =>
  jwt.sign({ id: Id }, process.env.SECRET_KEY, {
    expiresIn: process.env.Expire_Date,
  });

exports.login = asynchandler(async (req, res, next) => {
  // check if uset is exist
  // check if email and password are correct
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrrect email and password", 401));
  }
  const token = sendToken(user._id);

  res.status(200).json({
    data: user,
    token,
  });
});

exports.signup = asynchandler(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const token = sendToken(newUser._id);
  res.status(201).json({
    data: newUser,
    token,
  });
});

exports.protect = asynchandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError("Your are not login , please login and tey again ..", 401)
    );
  }

  // verify token
  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  // check if user is exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }
  // check if user change his password after token created
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asynchandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("Your are not allowed to access this route", 403)
      );
    }
    next();
    // 1) access roles
  });

exports.forgotPassword = asynchandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user in this email ${req.body.email}`, 404)
    );
  }
  // 2) If user exist , Generate hash random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Saved hash password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();
  // 3) Send the reset via email
  const message = `Hi ${user.name}.\n We received a request to reset your password on your E-commerce account.\n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password reset code (valid for 10 minutes)",
      message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }
  res.status(200).json({
    status: "success",
    message: "Reset code sent to your email",
  });
});

exports.verifyPasswordResetCode = asynchandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.code)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Invalid code or expire", 400));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Verified code was saved successfully",
  });
});

exports.resetPassword = asynchandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is not user with email ${req.body.email}`, 404)
    );
  }

  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetVerified = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetCode = undefined;

  await user.save();
  const token = sendToken(user._id);
  res.status(200).json({
    status: "success",
    message: "Reset password was successfully",
    token,
  });
});
