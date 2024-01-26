const Order = require("../models/order");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");

exports.newOrder = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;


    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
      orderStatus: "processing",
      createdAt: Date.now(),
    });


    res.status(200).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};


//get single order
exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    res.status(200).json({
      message: "Order retrieved successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

//get all orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();

    //total amount
    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      message: "Orders retrieved successfully",
      totalAmount,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

//get logged in user's order
exports.getLoggedInUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    next(error);
  }
};