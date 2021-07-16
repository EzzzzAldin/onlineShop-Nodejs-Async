const Product = require('../model/product.model');

exports.getHome = async (req, res) => {
    try {
        // Get Category Query
        let category = req.query.category;
        // Dynamic Category Get To Admin Route
        // Get ALl Products
        const productsList = await Product.find({});
        // Create Array Category of Products
        const categoryList = [];
        // Push Category Dynamic from Products
        productsList.forEach(product => {
            categoryList.push(product.category);
        })
        // Check If Found Category Show Products Of This Category
        if (category && categoryList.includes(category)) {
            const products = await Product.find({category: category});
            res.send(products);
        } else {
            // If Not Found Category Show All Products
            const products = await Product.find({});
            res.send(products);
        }
    } catch (error) {
        console.log(error);
    }
}