const Coupon = require("./../models/couponModel");
const handler = require("./handler/handlerFactory");

exports.createCoupon = handler.createOne(Coupon);

exports.getCoupon = handler.getOne(Coupon);

exports.getAllCoupons = handler.getAll(Coupon);

exports.updateCoupon = handler.updateOne(Coupon, "coupon");

exports.deleteCoupon = handler.deleteOne(Coupon, "coupon");
