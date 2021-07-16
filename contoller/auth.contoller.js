const Admin = require('../model/admin.model');
const User = require('../model/user.model');
const validation = require('./validation/validation');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postLogin = async (req, res) => {
    try {
        // validation Data
        const val = validation.validateLogin(req.body);
        // Find Admin & UserFrom DB
        const admin = await Admin.findOne({email: req.body.email});
        const user = await User.findOne({email: req.body.email});
        // Check If Email Not User
        if(!admin && !user) return res.status(400).send('Email Not Found');
        // Email Is Found In DB
        // OR Email Is Found Check Password
        if(admin) {
            // If User Is Admib
            checkUser(req, res, admin);
        } else {
            // If User Is Student
            checkUser(req, res, user);
        }
    } catch (error) {
        res.status(400).send(error.details[0].message);
    }
};

exports.getLogin = async (req, res) => {
    try {
        // validation Data
        // Find Admin From DB
        // Check If Email Not User
        // 
    } catch (error) {
        
    }
};

exports.postUserRegister = async (req, res) => {
    try {
        // Validate Data
        const val = await validation.validateRegistarAdmin(req.body);
        // Check Email Found Or No
        const checkEmail = await User.findOne({email: req.body.email});
        // If Found Email
        if (checkEmail) return res.status(400).send('Email Already Exist');
        // hash password
        const salt = 10;
        const hashedpassword =  await bcrypt.hashSync(req.body.password, salt);
        // create New User
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedpassword,
            repeat_password: hashedpassword
        });
        await user.save();
        res.send({
            message: 'Done Created New User Account'
        });
    } catch (error) {
        res.status(400).send(error.details[0].message);
    }
};


// Function Check If User Admin OR Student 
async function checkUser(req, res, user) {
    const comp = await bcrypt.compare(req.body.password, user.password);
        // If Password Is Wrong
        if(!comp) return res.status(400).send('Invailde Password');
        // If Password Is Correct
        // Create And Asgin A token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.header('token', token).send({
            message: "sucsse",
            token: token,
            user: user.name
        });
};