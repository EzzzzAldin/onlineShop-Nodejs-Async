const Cart = require('../model/cart.model');
const Admin = require('../model/admin.model');
const User = require('../model/user.model');
const Product = require('../model/product.model');

const validation = require('../contoller/validation/validation');


exports.getCart = async (req, res) => {
    try {
        const admin = await Admin.findById(req.userId._id);
        const user = await User.findById(req.userId._id);
        if (!admin && !user) return res.status(400).send("please Login Or Create Account");
        // Get All Cart And Sort By time
        const items = await Cart.find({userId: req.userId._id}, {}, {sort: {timestamp: 1}});
        res.send(items)
    } catch (error) {
        console.log(error);
    }
};

exports.postCart = async (req, res) => {
    try {
        const val = await validation.validatePostCart(req.body);
        // check user is user OR admin
        const admin = await Admin.findById(req.userId._id);
        const user = await User.findById(req.userId._id);
        if (!admin && !user) return res.status(400).send("please Login Or Create Account");
        // check if product in DB
        const product = await Product.findById({_id: req.body.productId});
        if (!product) return res.status(400).send('Product Is Not Found');
        // check if Item Found In CartModel
        const item = await Cart.findOne({userId:req.userId._id, productId: req.body.productId});
        if (item) {
            // increment Amount Of item
            await Cart.findOneAndUpdate({userId:req.userId._id, productId: req.body.productId}, {$inc: {amount: req.body.amount}});
            res.send({
                message: "Done Update Your amount Product"
            });
        } else {
            // create New Item
            let newItem = new Cart({
                name: req.body.name,
                price: req.body.price,
                amount: req.body.amount,
                userId: req.userId._id,
                productId: req.body.productId,
                timestamp: Date.now()
            });
            await newItem.save();
            res.send({
                message: "Done Added In Your Cart"
            });
        }
    } catch (error) {
        res.status(400).send(error.details[0].message);
    }
};

exports.postEdit = async (req, res) => {
    try {
        const val = await validation.validateEditCart(req.body);
        const admin = await Admin.findById(req.userId._id);
        const user = await User.findById(req.userId._id);
        if (!admin && !user) return res.status(400).send("please Login Or Create Account");
        // If Item If Not Fond
        const item = await Cart.findOne({userId: req.userId._id, productId: req.body.productId});
        if (!item) return res.status(400).send({ message: 'Product Not Found'});
        // Update New Amount
        await Cart.findOneAndUpdate({userId: req.userId._id, productId: req.body.productId}, {amount: req.body.amount});
        res.send({
            message: "Done Update Product Amount"
        });
    } catch (error) {
        res.status(400).send(error.details[0].message);
    }
};

exports.postDelete = async (req, res) => {
    try {
        const val = await validation.validateDeleteCart(req.body);
        const admin = await Admin.findById(req.userId._id);
        const user = await User.findById(req.userId._id);
        if (!admin && !user) return res.status(400).send("please Login Or Create Account");
        // If Item If Not Fond
        const item = await Cart.findOne({userId: req.userId._id, productId: req.body.productId});
        if (!item) return res.status(400).send({ message: 'Product Not Found'});
        await Cart.findOneAndDelete({userId: req.userId._id, productId: req.body.productId});
        res.send({
            message: "Done Deleted Product"
        });
    } catch (error) {
        res.status(400).send(error.details[0].message);
    }
};

exports.postDeleteAll = async (req, res) => {
    try {
        const admin = await Admin.findById(req.userId._id);
        const user = await User.findById(req.userId._id);
        if (!admin && !user) return res.status(400).send("please Login Or Create Account");
        await Cart.deleteMany({userId: req.userId._id});
        res.send({
            message: "Done Deleted All Products"
        });
    } catch (error) {
        res.status(400).send(error.details[0].message);
    }
};