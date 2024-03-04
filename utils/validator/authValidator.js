const { check, body } = require("express-validator");
const validatorMiddleware = require("./../../middleware/validatorMiddleware");
const User = require("./../../models/userModels");
const ApiError = require('./../apiError');
exports.signupValidator = [
  check("email")
    .notEmpty()
    .withMessage("Please enter your email address")
    .custom(async (val) => {
      const user = await User.findOne({ email: val })
      if (user) { 
        throw new Error('Email already in use');
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .custom((pass, { req }) => {
      if (pass != req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect')
      }
      return true;
    }),
  check("name").notEmpty().withMessage("Please enter your name"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Please enter your passwordConfirm"),
  validatorMiddleware,
];

exports.loginValidator = [
  check('email').notEmpty().withMessage("Please enter your email"),
  check('password').notEmpty().withMessage("Please enter your password"),
  validatorMiddleware,
];
