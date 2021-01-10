const mongoose = require('mongoose');

const productShema = mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    description: String,
    image: String
});

const Product = mongoose.model('product', productShema);

module.exports = Product;