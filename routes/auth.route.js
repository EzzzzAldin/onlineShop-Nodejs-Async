const router = require('express').Router();
const bodyParser = require('body-parser');
// Init express-validtor
const check = require('express-validator').check;

const authGuard = require('./guards/auth.guard');
const authController = require('../controllers/auth.controller');

router.get('/signup', authGuard.notAuth, authController.getSignup);

router.post('/signup', authGuard.notAuth, bodyParser.urlencoded({extended: true}), 
    // Chack Valid Username
    check('username').not().isEmpty(),
    // Check Valid E-mail
    check('email').not().isEmpty().withMessage('E-mail is required').isEmail().withMessage('Invalid Format'),
    // Check Password
    check('password').not().isEmpty().withMessage('Password is required').isLength({min: 6}).withMessage('Password must be at least 6 characheter'),
    // Check Vaild Confirm Password
    check('confiremPassword').custom((value, {req} ) => {
        // Compare password equal confirm Password
        if( value === req.body.password) return true
        else throw 'passwords are not same';
    }),
    authController.postSignup
);

router.get('/login', authGuard.notAuth, authController.getLogin);

router.post('/login', authGuard.notAuth, bodyParser.urlencoded({extended: true}),
    // Chek Valid Email
    check('email').not().isEmpty().withMessage('E-mail is requird').isEmail().withMessage('Invalid Format'),
    // Check Password
    check('password').not().isEmpty().withMessage('Password is requird').isLength({min: 6}).withMessage('Password must be at least 6 charachete'),
    authController.postLogin);

router.all('/logout', authGuard.isAuth, authController.logout);

module.exports = router;