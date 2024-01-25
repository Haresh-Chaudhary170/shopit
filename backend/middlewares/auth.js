const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/user");

// check if user is authenticated or not
exports.isAuthenticatedUser = async (req, res, next) => {   
  const {token}= req.cookies;
   if(!token){
    return next(
        new ErrorHandler("You are not authorized!", 401)
    )
  }
  const decoded= jwt.verify(
    token,
    process.env.JWT_SECRET
  )
  req.user= await User.findById(decoded._id);
  next();
  
};

//handle user roles
exports.authorizedRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHandler("You are not authorized!", 403)
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};