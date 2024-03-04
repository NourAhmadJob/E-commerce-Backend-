const express = require('express');

const router = express.Router();

const { signupValidator , loginValidator } = require('./../utils/validator/authValidator')

const { signup  , login  , forgotPassword , verifyPasswordResetCode , resetPassword} = require('./../controller/authController');

router.post('/signup', signupValidator, signup);

router.post('/login', loginValidator, login);

router.post('/forgotPassword', forgotPassword);

router.post('/verifyResetCode', verifyPasswordResetCode);

router.put('/resetPassword', resetPassword);

module.exports = router;