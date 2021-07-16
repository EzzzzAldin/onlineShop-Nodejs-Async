const mongooose = require('mongoose');

const orderSchema = mongooose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    },
    adderss: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    }, 
    status: {
        type: String,
        default: 'Pending'
    }
});

const Order = mongooose.model('Order', orderSchema);

module.exports = Order;