const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Create a new user
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "upload/v1312461204/sample",
        url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      },
    });

    await sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

//login user
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    await sendToken(user, 200, res);
  } catch (error) {
    next(error); // Pass any error to the error handler middleware
  }
};

//forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new ErrorHandler("Please provide email", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("No user fond with provided email.", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    //create reset password url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reseT/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`;

    try {
      await sendEmail({
        email: email,
        subject: "Shop-It Password Recovery",
        message,
      });
      res.status(200).json({
        success: true,
        message: `An e-mail has been sent to ${user.email} for further process.`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler("Something went wrong " + error, 500));
    }
  } catch (error) {
    next(error);
  }
};

//reset password
exports.resetPassword = async (req, res, next) => {
  try {
    //hash token from url
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const newPassword = req.body.password;

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorHandler("Token is invalid or has expired", 400)
      );
    }
    //check password and confirm paasword same
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Passwords do not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// get currently logged in user details
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//change password
exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    //check old password
    const isMatch = await user.comparePassword(req.body.oldPassword);
    if (!isMatch) {
      return next(new ErrorHandler("Old password is invalid!", 401));
    }

    user.password = req.body.password;
    await user.save();
    sendToken(user,200,res);

  } catch (error) {
    next(error);
  }  
};

  //update user profile
  exports.updateProfile= async (req, res, next)=>{
    try {
      const newData={
        name:req.body.name,
        email:req.body.email
      }
      const user = await User.findByIdAndUpdate(req.user._id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

// logout user
exports.logoutUser = (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Successfully logged out",
  });
};

// get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

//Get user details
exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler(`User not found with id ${req.params.id}`, 404))
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

//update user profile
exports.updateUserDetails= async (req, res, next)=>{
  try {
    const newData={
      name:req.body.name,
      email:req.body.email,
      role:req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
}
//delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler(`User not found with id ${req.params.id}`, 404))
    }

    // Delete the user
    await User.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
