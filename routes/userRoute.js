const express = require("express");
const userRoute = express.Router();
const userController = require("./../controller/userController");
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require("../utils/validator/userValidator");

userRoute
  .route("/")
  .post(createUserValidator, userController.createUser)
  .get(userController.getAllUser);

userRoute
  .route("/:id")
  .get(getUserValidator, userController.getUser)
  .put(updateUserValidator, userController.updateUser)
  .delete(deleteUserValidator, userController.deleteUser);

module.exports = userRoute;
