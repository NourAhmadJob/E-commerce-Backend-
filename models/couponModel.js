const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Pleaes enter name of coupon"],
      trim: true,
      uniqe: true,
    },
    expire: {
      type: Date,
      required: [true, "Please enter expiration date for coupon"],
    },
    discount: {
      type: Number,
      required: [true, "Please enter discount for coupon"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
