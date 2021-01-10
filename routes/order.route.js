const router = require('express').Router();
const bodyParser = require('body-parser');
const check = require('express-validator').check;

const authGuard = require('./guards/auth.guard');

const orderController = require('../controllers/order.controller');

router.get('/verify-order', authGuard.isAuth, orderController.getOrderVerify);

router.get('/orders', authGuard.isAuth, orderController.getOrder);


router.post('/orders', authGuard.isAuth, bodyParser.urlencoded({extended: true}),
    check('address')
        .not()
        .isEmpty()
        .withMessage('address is required'),
    orderController.postOrder
);

router.post('/orders/cancel', authGuard.isAuth, bodyParser.urlencoded({extended: true}), orderController.postCancel);
router.post('/orders/cancelAll', authGuard.isAuth, bodyParser.urlencoded({extended: true}), orderController.postCancelAll);


module.exports= router;