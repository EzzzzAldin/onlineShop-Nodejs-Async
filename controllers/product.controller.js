const Product = require('../models/products.model');
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URI;

exports.getProduct = async (req, res) => {
    try {
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Get First Product
        let product = await Product.findOne({});
        res.render('product', {
            pageTitle: 'Product Delalies',
            product: product,
            isUser: req.session.userId,
            isAdmin: req.session.isAdmin
        });
    } catch (error) {
        res.redirect('/error')
    }
}

exports.getProductById = async (req, res) => {
    try {
        // Get ID
        let id = req.params.id;
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Find Product By Id
        let product = await Product.findById(id);
        // Show Product
        res.render('product', {
            pageTitle: product.name,
            product: product,
            isUser: req.session.userId,
            isAdmin: req.session.isAdmin,
            validationErrors: req.flash('validationErrors')[0]
        });
    } catch (error) {
        res.redirect('/error')
    }
};