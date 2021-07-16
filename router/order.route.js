const router = require('express').Router();

const orderController = require('../contoller/order.controller');
const verify = require('../contoller/validation/verifyToken');

router.get('/order-get', verify.tokenVerify, orderController.getOrder);

router.post('/order-post/:id', verify.tokenVerify, orderController.postOrder);

router.post('/order-cancel', verify.tokenVerify, orderController.postCancelOrder);

router.post('/order-cancel-all', verify.tokenVerify, orderController.postCancelAllOrder);




module.exports = router;