const router = require('express').Router();

const authController = require('../contoller/auth.contoller');


router.post('/login', authController.postLogin);

router.post('/register-user', authController.postUserRegister);




module.exports = router;