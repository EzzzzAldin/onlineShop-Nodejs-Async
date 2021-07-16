const mongooose = require('mongoose');

const cartSchema = mongooose.Schema({
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
    }
});

const Cart = mongooose.model('Cart', cartSchema);

module.exports = Cart;