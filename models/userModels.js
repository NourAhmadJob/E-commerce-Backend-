const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already exists"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    passwordResetCode: String, 
    passwordResetExpires: Date, 
    passwordResetVerified : Boolean,
    phone: String,
    profileImage: String,
    role: {
      type: String,
      enum: ["user", "manager" ,"admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) { 
  // not changed in password 
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12)
  return next();
}) 

const User = mongoose.model("Users", userSchema);

module.exports = User;
