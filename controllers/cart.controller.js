const cartItem = require('../models/cart.model');
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URI;
const validationResult = require('express-validator').validationResult;

exports.getCart = async (req, res) => {
    try {
        // DB Connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Find UserID And Sort data in ascending order
        const items = await cartItem.find({userId: req.session.userId}, {}, {sort: {timestamp: 1}});
        // Show Cart Data
        res.render('cart', {
            pageTitle: 'Cart',
            items: items,
            isUser: true,
            isAdmin: req.session.isAdmin,
            validationErrors: req.flash('validationErrors')[0]
        })

    } catch (error) {
        mongoose.disconnect();
        res.redirect('/error');
    }
};

exports.postCart = async (req, res) => {
    try {
        // Check Errrors
        if( validationResult(req).isEmpty()) {
            // DB connect
            await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
            // Find Item In DB
            const item = await cartItem.findOne({productId: req.body.productId});
            if(item) {
                // If Item found In DB incremnt Number Item
                await cartItem.findOneAndUpdate({productId: req.body.productId}, {$inc : {amount: req.body.amount}});
                res.redirect('/cart')
            } else {
                // If Not Found Create New Irem in Cart
                // Get New Data Item
                let newItem = new cartItem({
                    name: req.body.name,
                    price: req.body.price,
                    amount: req.body.amount,
                    productId: req.body.productId,
                    userId: req.session.userId,
                    timestamp: Date.now()
                });
                await newItem.save();
                res.redirect('/cart')
            }
        } else {
            req.flash('validationErrors', validationResult(req).array());
            // Use req.body.redirectTo Becouse if User add Cart in home OR in ProductDetlies Page
            res.redirect(req.body.redirectTo);
        }
    } catch (error) {
        mongoose.disconnect();
        res.redirect('/error');
    };
};

exports.postSave = async (req, res) => {
    try {
        if( validationResult(req).isEmpty()) {
            // DB connect
            await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
            // Pass User Id and Update New Amount
            await cartItem.updateOne({_id: req.body.cartId}, {
                amount: req.body.amount, 
                timestamp: Date.now()
            });
            res.redirect('/cart');
        } else {
            req.flash('validationErrors', validationResult(req).array());
            res.redirect('/cart');
        }
    } catch (error) {
        mongoose.disconnect();
        res.redirect('/error');
    }
};

exports.postDelete = async (req, res) => {
    try {
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Find Data And Delete
        await cartItem.findByIdAndDelete(req.body.cartId);
        res.redirect('/cart');
    } catch (error) {
        res.redirect('/error');
    }
};

exports.postDeleteAll = async (req, res) => {
    try {
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Find Data And Delete
        await cartItem.deleteMany(req.body.id);
        res.redirect('/cart');
    } catch (error) {
        res.redirect('/error');
    }
};