const express = require("express");
const authController = require("./../controller/authController");
const router = express.Router();
const { addAddress , removeAddress , getLoggedUserAddress } = require('./../controller/addressController')
router.use(authController.protect, authController.allowedTo("user"));

router.route('/').post(addAddress).get(getLoggedUserAddress);

router.route('/:addressId').delete(removeAddress)

module.exports = router;