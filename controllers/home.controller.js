const Product = require('../models/products.model');
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URI;

exports.getHome = async (req, res) => {
    // Get category
    let category = req.query.category;
    // Valid Category
    let validCategories = ['clothes', 'phones', 'computers'];
    // Function Render Products
    const renderProduct = products => {
        res.render('index', {
            products: products,
            isUser: req.session.userId,
            isAdmin: req.session.isAdmin,
            validationErrors: req.flash('validationErrors')[0],
            pageTitle: 'Home'
        })
    }
    // If Client Use Category Products
    if( category && validCategories.includes(category)) {
        try {
            // DB connect
            await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
            // Find Products By Category
            let products = await Product.find({category: category});
            // Run Function Render Products
            renderProduct(products);
        } catch (error) {
            res.redirect('/error')
        }
    } else {
        // If Client Show All Products
        try {
            // DB connect
            await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
            // Get All Products
            let products = await Product.find({});
            // Run Function Render Products
            renderProduct(products);
        } catch (error) {
            res.redirect('/error')
        }

    }
};