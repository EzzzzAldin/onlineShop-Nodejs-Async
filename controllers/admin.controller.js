const Product = require('../models/products.model');
const Order = require('../models/order.model');
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URI;
const validationResult = require('express-validator').validationResult;  

exports.getAdd = (req, res) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        validationErrors: req.flash('validationErrors'),
        isUser: true,
        isAdmin: true,
        productAdded: req.flash("added")[0]
    });
};

exports.postAdd = async (req, res) => {
    try {
        if( validationResult(req).isEmpty()) {
            // DB connect
            await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
            // Get Image
            req.body.image = req.file.filename;
            let newProduct = await new Product(req.body);
            newProduct.save();
            req.flash('added', true);
            res.redirect("/admin/add");
        } else {
            req.flash('validationErrors', validationResult(req).array());
            res.redirect("/admin/add");
        }
    } catch (error) {
        mongoose.disconnect();
        res.redirect('/error');
    }
};

exports.getOrders = async (req, res) => {
    try {
        // DB Connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Get All Items Orders
        const items = await Order.find({}, {}, {sort: {timestamp: 1}});
        // Show All Items
        res.render('manage-orders', {
            pageTitle: 'Mange Orders',
            isUser: true,
            isAdmin: true,
            items: items
        });
    } catch (error) {
         res.redirect('/error');
         console.log(error);
    }
};

exports.postOrders = async (req, res) => {
    try {
        // DB Connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Update Status
        await Order.updateOne({_id: req.body.orderId}, {status: req.body.status});
        res.redirect("/admin/orders")
    } catch (error) {
         res.redirect('/error');
         console.log(error);
    }
};