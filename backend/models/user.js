const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name."],
    trim: true,
    maxlength: [30, "Name should not exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  avatar: {
    public_id: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});
//encripting password before saving it
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

//compare user password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Return JWT token
userSchema.methods.getJwtToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      // role: this.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    }
  );
};

//generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const reseTToken = crypto.randomBytes(20).toString("hex");

  //Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(reseTToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;

  return reseTToken;
};
module.exports = mongoose.model("User", userSchema);
