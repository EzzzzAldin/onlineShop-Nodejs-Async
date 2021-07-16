const Product = require('../model/product.model');


exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.send(products);
    } catch (error) {
        console.log(error);
    }
};

exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        res.send(product);
    } catch (error) {
        console.log(error);
    }
}