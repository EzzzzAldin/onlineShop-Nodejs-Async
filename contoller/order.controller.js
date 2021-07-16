const User = require('../model/user.model');
const Cart = require('../model/cart.model');
const Order = require('../model/order.model');

const validation = require('./validation/validation');

exports.getOrder = async (req, res) => {
    try {
        const orders = await Order.find({userId: req.userId._id}, {}, {sort: {timestamp: 1}});
        if (!orders || orders[0] === undefined) return res.status(400).send("Not Have Any Orders");
        res.send(orders);
    } catch (error) {
        console.log(error);
    }
};

exports.postOrder = async (req, res) => {
    try {
        const val = await validation.validatePostOrder(req.body);
        // Check If cart Found
        const cart = await Cart.findById(req.params.id);
        if (!cart) return res.status(400).send("This Cart Not Found");
        // Create New Order
        await Cart.deleteOne({_id: req.params.id});
        const order = new Order({
            name: req.body.name,
            price: req.body.price,
            amount: req.body.amount,
            userId: req.userId._id,
            productId: req.body.productId,
            timestamp: Date.now(),
            adderss: req.body.adderss,
            email: req.body.email

        });
        await order.save();
        res.send({
            message: "Done Create Order"
        })
    } catch (error) {
        res.status(400).send(error.details[0].message);
        console.log(error);
    }
};

exports.postCancelOrder = async (req, res) => {
    try {
        const val = await validation.validateDeleteCart(req.body);
        const order = await Order.findOne({userId: req.userId._id, productId: req.body.productId});
        if (!order) return res.status(400).send("This Order Not Exist");
        if (order.status != 'Pending') return res.send({message: "Can not Cancel This Order Becouse Arrive"});
        await Order.deleteOne({userId: req.userId._id, productId: req.body.productId});
        res.send({
            message: "Done Cancel Order"
        })
    } catch (error) {
        res.status(400).send(error.details[0].message);
        console.log(error);
    }
};

exports.postCancelAllOrder = async (req, res) => {
    try {
        const orders = await Order.find({userId: req.userId._id});
        if (!orders) return res.status(400).send("This Order Not Exist");
        // Check All Status Orders 
        let status = 'Pending';
        orders.forEach( order => {
            if (order.status != 'Pending') return status = 'arr';
        });
        if (status != 'Pending') return res.send({message: "Can not Cancel All Orders Becouse Some Order Arrive"});
        await Order.deleteMany({userId: req.userId._id});
        res.send({
            message: "Done Deleted All Products"
        });
    } catch (error) {
        console.log(error);
    }
};