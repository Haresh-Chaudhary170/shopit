const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');
const path = require('path');
const product= require('../data/products.json');

dotenv.config({
    path: path.resolve(__dirname, '../config/config.env') // Use path.resolve to ensure the correct path
});

connectDatabase();

const seedProduct = async () => {
    try {
        await Product.deleteMany({});
        await Product.insertMany(product);
        console.log("Products seeded");
        process.exit(0);
        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedProduct();
