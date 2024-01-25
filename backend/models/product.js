const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product name"],
    trim: true,
    maxLength: [100, "Name should not exceed 100 characters."],
  },
  price: {
    type: Number,
    required: [true, "Please Enter product price"],
    default: 0.0,
    maxLength: [5, "Price should not exceed 5 characters."],
  },
  description: {
    type: String,
    required: [true, "Please Enter product description."],
  },
  rating: {
    type: Number,
    default: 0.0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please select the category."],
  },
  seller: {
    type: String,
    required: [true, "Please select the seller."],
  },
  stock: {
    type: Number,
    default: 0,
    required: [true, "Please enter the stock."],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
