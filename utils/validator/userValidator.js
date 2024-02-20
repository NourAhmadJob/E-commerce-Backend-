const { check, body } = require("express-validator");
const validatorMiddleware = require("./../../middleware/validatorMiddleware");
const Users = require("../../models/userModels");
const ApiError = require("../apiError");
exports.createUserValidator = [
  check("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) => {
      const user = Users.findOne({ email: val });
      if (!user) { 
        throw new Error("E-mail is already in use");
      }
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-SY", "ar-EG"])
    .withMessage("Invaild phone number only accepted in Syria and Egypt"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at length 6 characters")
    .custom((val, { req }) => {
      if (val != req.body.confirmPassword) {
        throw new Erorr("confirmPassword is incorrect");
      }
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword is required"),
  check("profileImage").optional(),

  check("role").optional(),

  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];
