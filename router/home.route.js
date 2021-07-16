const router = require('express').Router();

const homeController = require('../contoller/home.controller');

router.get('/', homeController.getHome);


module.exports = router;