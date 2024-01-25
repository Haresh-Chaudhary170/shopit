const Product = require("../models/product");
const ErrorHandler=require('../utils/errorHandler');
const APIFeatures =require('../utils/apiFeatures');

exports.addProduct = async (req, res, next) => {
  try {
    req.body.user=req.user._id;
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const resultsPerPage=3;
    // const productCount=Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter( ).pagination(resultsPerPage);
    const products = await apiFeatures.query;
    // const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      // productCount:productCount,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler('Product not Found', 404))
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({
        message: "Product not found.",
        success: false,
      });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      product,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found.",
                success: false,
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error.message,
        });
    }
};