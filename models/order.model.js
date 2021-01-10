const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    name: String,
    price: Number,
    amount: Number,
    userId: String,
    productId: String,
    timestamp: Number,
    address: String,
    email: String,
    status: {
        type: String,
        default: "Pending"
    },
    timestamp: Number
});

const Order = mongoose.model('order', orderSchema);

module.exports = Order;