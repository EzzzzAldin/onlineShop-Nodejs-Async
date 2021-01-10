const router = require('express').Router();
const bodyParser = require('body-parser');
const check = require('express-validator').check;

// Init Module multer To work Form type multipart
const multer = require('multer');

const adminController = require('../controllers/admin.controller');
const adminGuard = require('./guards/admin.guard');

router.get('/add', adminGuard, adminController.getAdd);
router.post('/add', adminGuard,
     multer({
         storage: multer.diskStorage({
            //  Propartiy to location upload
            destination: (req, file, cb) => {
                // Name Location upload Images
                cb(null, 'images');
            },
            filename: (req, file, cb) => {
                // To Show Picture in Files Images It is not encrypted or duplicated
                cb(null, Date.now() + '-' + file.originalname)
            }
         })
     }).single('image'),
     check('name')
        .not()
        .isEmpty()
        .withMessage('name is requird'),
     check('price')
        .not()
        .isEmpty()
        .withMessage('Price is requird')
        .isFloat({ min: 0.0000000009 })
        .withMessage("price must be greater than 0"),
     check('description')
        .not()
        .isEmpty()
        .withMessage('Description is requird'),
     check('category')
        .not()
        .isEmpty()
        .withMessage('Category is requird'),
     check('image').custom((value, {req}) => {
         if( req.file) return true
         else throw 'image is rquierd'
     }), 
     adminController.postAdd
     
);

router.get('/orders', adminGuard, adminController.getOrders);
router.post('/orders', adminGuard, bodyParser.urlencoded({extended: true}), adminController.postOrders);


module.exports = router;