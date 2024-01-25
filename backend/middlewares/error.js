const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      errorMessage: err.message,
      stack: err.stack,
      error: err,
    });
  }
  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };
    error.message = err.message;
    if (error.name === "CastError") {
      const message = `Resource not found. Invalid ${error.path}`;
      error = new ErrorHandler(message, 400);
    } else if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((val) => val.message);
      error = new ErrorHandler(message, 400);
    }

    //handling mongoose dublicate key errors
    else if (error.code === 11000) {
      const message = `The ${Object.keys(err.keyValue)} already exists`;
      error = new ErrorHandler(message, 400);
    }

    //HANDLING WRONG JWT TOKEN
    if (err.name === "JsonWebTokenError") {
      error = new ErrorHandler("Invalid token!. Please try again.", 401);
    }

    //handling expired jwt token
    else if (err.name === "TokenExpiredError") {
      error = new ErrorHandler(
        "Your token has expired. Please try again.",
        401
      );
    }

    res.status(err.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
