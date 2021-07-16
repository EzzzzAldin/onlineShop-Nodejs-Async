const router = require('express').Router();

const adminController = require('../contoller/admin.contoller');
const verify = require('../contoller/validation/verifyToken');

const multer = require('multer');

router.post('/register-admin', verify.tokenVerify, adminController.postAdminRegister);

router.post('/add-product', verify.tokenVerify, adminController.uploadImg, adminController.postAddProduct);

router.put('/edit-product', verify.tokenVerify, adminController.uploadImg, adminController.editProduct);

router.get('/order-get', verify.tokenVerify, adminController.getOrders);

router.post('/order-post', verify.tokenVerify, adminController.postOrder);

router.post('/user-profile', verify.tokenVerify, adminController.getUserProfile);

router.get('/dashbord', verify.tokenVerify, adminController.dashbord);


module.exports = router;