const mongoose = require('mongoose');

const cartShecma = mongoose.Schema({
    name: String,
    price: Number,
    amount: Number,
    userId: String,
    email: String,
    productId: String,
    timestamp: Number
});

const cartItem = mongoose.model('cart', cartShecma);

module.exports = cartItem;