const router = require('express').Router();

const cartController = require('../contoller/cart.controller');
const verify = require('../contoller/validation/verifyToken');

router.post('/cart-post', verify.tokenVerify, cartController.postCart);

router.get('/cart-get', verify.tokenVerify, cartController.getCart);

router.post('/cart-edit', verify.tokenVerify, cartController.postEdit);

router.post('/cart-delete', verify.tokenVerify, cartController.postDelete);

router.post('/cart-delete-all', verify.tokenVerify, cartController.postDeleteAll);



module.exports = router