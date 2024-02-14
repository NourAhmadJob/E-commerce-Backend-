const express = require('express');
const userRoute = express.Router();
const userController = require('./../controller/userController') 

userRoute.post('/register', userController.signup)

userRoute.post('/login', userController.login)

// userRoute.post('/forgotPassword', userController.forgetPassword)

userRoute.post('/resetPassword' , userController.resetPassword)

userRoute.route('/').get( userController.protects,userController.restrictTo("admin"-"lead-guide"),userController.getAllUser)

module.exports = userRoute; 