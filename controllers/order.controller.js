const Order = require('../models/order.model');
const CartItem = require('../models/cart.model');
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URI;

const validationResult = require('express-validator').validationResult;

exports.getOrderVerify = async (req, res) => {
    try {
        // DB Connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        const cartItem = await CartItem.findById(req.query.order);
        res.render('verify-order', {
            pageTitle: 'Verify Order',
            cart: cartItem,
            isUser: true,
            validationError: req.flash("validationErrors")[0]
        })
    } catch (error) {
         res.redirect('/error');
         console.log(error);
    }
};

exports.getOrder = async (req, res) => {
    try {
        if(validationResult(req).isEmpty()) {
            // DB Connect
            await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
            // Find Data Item And Sort
            const items = await Order.find({userId: req.session.userId}, {}, {sort: {timestamp: 1}});
            // Show All Orders
            res.render("orders", {
                pageTitle: "Orders",
                isUser: true,
                isAdmin: req.session.isAdmin,
                items: items
            });

        } else {
                req.flash("validationErrors", validationResult(req).array());
                res.redirect("/verify-order?order=" + req.body.cartId);
            }
        
    } catch (error) {
        res.redirect('/error');
        console.log(error);
    };
};

exports.postOrder = async (req, res) => {
    try {
        if(validationResult(req).isEmpty()) {
            // Delete Item In Cart
            await CartItem.findByIdAndDelete(req.body.cartId);
            // DB Connect
            await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
            req.body.timestamp = Date.now();
            // Set Item In Orders
            let order = await new Order(req.body);
            await order.save();
            res.redirect('/orders');
        } else {
                req.flash("validationErrors", validationResult(req).array());
                res.redirect("/verify-order?order=" + req.body.cartId);
            }
        
    } catch (error) {
        res.redirect('/error');
        console.log(error);
    };
};

exports.postCancel = async (req, res) => {
    try {
        // DB Connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Find Data Item And Delet
        await Order.findByIdAndDelete(req.body.orderId);
        res.redirect('/orders');
    } catch (error) {
        res.redirect('/error');
        console.log(error);
    };
};

exports.postCancelAll = async (req, res) => {
    try {
        // DB Connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Find Data Item And Delet All Orders
        await Order.deleteMany(req.body.id);
        res.redirect('/orders');
    } catch (error) {
        res.redirect('/error');
        console.log(error);
    };
};