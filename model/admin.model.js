const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 5,
        max: 1024
    },
    product: [{
        type: String,
        ref: 'Product'
    }]
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;