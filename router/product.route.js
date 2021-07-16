const router = require('express').Router();

const productController = require('../contoller/product.controller');
const verify = require('../contoller/validation/verifyToken');

router.get('/', productController.getAllProducts);

router.get('/:id', productController.getProductById);




module.exports = router;