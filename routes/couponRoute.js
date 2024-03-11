const express = require("express");

const router = express.Router();

const {
  createCoupon,
  getCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("./../controller/couponsController");

router.route("/").post(createCoupon).get(getAllCoupons);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
