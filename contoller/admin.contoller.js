const Admin = require('../model/admin.model');
const Product = require('../model/product.model');
const Cart = require('../model/cart.model');
const Order = require('../model/order.model');

const validation = require('./validation/validation');

const bcrypt = require('bcrypt');
const multer = require('multer');
const User = require('../model/user.model');


const storage = multer.diskStorage({
    // path Stored
    destination: function (req, file, cb) {
        cb (null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

exports.uploadImg = multer({storage: storage}).single('image');

exports.postAdminRegister = async (req, res) => {
    try {
        // Validate Data
        const val = await validation.validateRegistarAdmin(req.body);
        // Check Email Exist
        const checkEmail = await Admin.findOne({email: req.body.email})
        // If Email Exist
        if(checkEmail) return res.status(400).send('Email Already Exist');
        // If Email Not Do Bcrypt
        const saltRounds = 10;
        // Hashed Password
        const hashedpassword = await bcrypt.hashSync(req.body.password, saltRounds);
        // Create New Admin
        const admin = new Admin({
            name: req.body.name,
            email: req.body.email,
            password: hashedpassword,
            repeat_password: hashedpassword
        });
        await admin.save();
        res.send({
            message: "Done Create New Account Admin"
        })
    } catch (error) {
        res.status(400).send(error.details[0].message);
    }
};

exports.postAddProduct = async (req, res) => {
    try {
        // Validate Data
        const val = await validation.validatepostAddProduct(req.body);
        // Get Admin Data & Check
        const admin = await Admin.findById(req.userId._id).populate({
            path: 'admin',
            model: 'Admin',
            select: 'name'
        });
        if(!admin) return res.status(400).send('You Are Not Admin');
        // If User Admin
        // Add New Product
        req.body.image = req.file.filename;
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            image: req.body.image,
            author: admin,
            discount: req.body.discount,
            newPrice: req.body.price - ( req.body.price * (req.body.discount / 100) )
        });
       await product.save();
       // push product to admin upload 
       admin.product.push(product._id);
       await admin.save();
       res.send(product)
    } catch (error) {
        res.status(400).send(error.details[0].message);
    }
};

exports.editProduct = async (req, res) => {
    try {
        // Validate Data
        const val = await validation.validateEditProduct(req.body);
        // Get Admin Data & Check
        const admin = await Admin.findById(req.userId._id).populate({
            path: 'admin',
            model: 'Admin',
            select: 'name'
        });
        if(!admin) return res.status(400).send('You Are Not Admin');
        // If User Admin
        // Check Product Is Found
        const product = await Product.findById({_id: req.body.id});
        if (!product) return res.status(400).send('Not Found Product');
        req.body.image = req.file.filename;
        await Product.updateMany({_id: req.body.id}, {
                name: req.body.name,
                price: req.body.price,
                category: req.body.category,
                description: req.body.description,
                image: req.body.image,
                author: admin,
                discount: req.body.discount,
                newPrice: req.body.price - ( req.body.price * (req.body.discount / 100) )
        });
        res.send({
            message: 'done Edit Product'
        });
    } catch (error) {
        res.status(400).send(error.details[0].message);
    }
};

exports.getOrders = async (req, res) => {
    try {
        const admin = await Admin.findById(req.userId._id);
        if (!admin) return res.status(400).send("You Are Not Admin");
        const orders = await Order.find({}, {}, {sort: {timestamp: 1}});
        if (orders[0] === undefined) return res.send("Not Found Any Orders");
        res.send(orders);
    } catch (error) {
        console.log(error);
    }
};

exports.postOrder = async (req, res) => {
    try {
        const val = await validation.validatePostOrderAdmin(req.body);
        // Check Admin
        const admin = await Admin.findById(req.userId._id);
        if (!admin) return res.status(400).send("You Are Not Admin");
        const order = await Order.findById(req.body.orderId);
        if (!order) return res.status(400).send("This Order Not Found!");
        await Order.updateOne({_id: req.body.orderId}, {status: req.body.status});
        res.send({
            message: "Done Change Status Order"
        })
    } catch (error) {
        res.status(400).send(error.details[0].message);
    }
};

exports.dashbord = async (req, res) => {
    try {
        const admin = await Admin.findById(req.userId._id);
        if (!admin) return res.status(400).send("You Are Not Admin");
        // Get Number Of Users
        const admins = await Admin.find({});
        // Get Number Of Users
        const users = await User.find({});
        // Get Number Of Products
        const products = await Product.find({});
        // Get Number Of Carts
        const carts = await Cart.find({});
        // Get Number Of Orders
        const orders = await Order.find({});
        res.send({
            numberAdmins: admins.length,
            numberUsers: users.length,
            numberProducts: products.length,
            numberCarts: carts.length,
            numberOrders: orders.length
        })
    } catch (error) {
        console.log(error);
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const val = await validation.validategetUser(req.body);
        const admin = await Admin.findById(req.userId._id);
        if (!admin) return res.status(400).send("You Are Not Admin");
        const user = await User.find({email: req.body.email});
        if (!user) return res.status(400).send("Not Found This User");
        res.send(user);
    } catch (error) {
        res.status(400).send(error.details[0].message);
    }
};