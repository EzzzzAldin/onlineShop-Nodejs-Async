const User = require('../models/auth.model');
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URI;

const bcrybt = require('bcrypt');
// Init Result express-validator
const validationResult = require('express-validator').validationResult;


exports.getSignup = (req, res) => {
    res.render('signup', {
        pageTitle: 'Signup',
        // Show Error in Page
        authError: req.flash('authError')[0],
        validationErrors: req.flash('validationErrors'),
        isUser: false,
        isAdmin: false
    });
};


exports.postSignup = async (req, res) => {
    try {
        // Check Error
        if( validationResult(req).isEmpty()) {
            // DB Connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Check Emaile Exits
        const checkUser = await User.findOne({email: req.body.email});
        if(checkUser) {
            res.render('emailerr', {
                pageTitle: 'Error Signup',
                err: 'Email Is Used'
            })
        } else {
            // If Email not Exist Create New Account
            const saltRounds = 10;
            const hashedPassword = bcrybt.hashSync(req.body.password, saltRounds);
            let user = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            });
            await user.save();
            res.redirect('/login');
        }
    } else {
        req.flash('validationErrors', validationResult(req).array());
        res.redirect('/signup');
    }
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.getLogin = (req, res) => {
    res.render('login', {
        pageTitle: 'Login',
        // Show Error auth in Login Page
        authError: req.flash('authError')[0],
        validationErrors: req.flash('validationErrors'),
        isUser: false,
        isAdmin: false
    });
};

exports.postLogin = async (req, res) => {
    try {
        // Check Errors
        if( validationResult(req).isEmpty()) {
            // DB connect
            await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
            // Find User
            const user = await User.findOne({email: req.body.email});
            // Chek if User Found In DB
            if(!user) {
                // If Email Not Found In DB
                mongoose.disconnect();
                res.render('emailerr', {
                    pageTitle: 'Error Login',
                    err: 'there is no user matches this email'
                })
            } else {
                // Check Corecct Password
                const comp = await bcrybt.compare( req.body.password, user.password);
                if(comp) {
                    // If Password Correct Pass Data To Reqest.session
                    req.session.userId = user.email;
                    req.session.isAdmin = user.isAdmin;
                    res.redirect('/');
                } else {
                    // If Password Is Incorrect
                    mongoose.disconnect();
                    res.render('emailerr', {
                        pageTitle: 'Error Login',
                        err: 'the Password is incorrect'
                    })
                }
            };
        } else {
            req.flash('validationErrors', validationResult(req).array());
            res.redirect('/login')
        }
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    };
};

exports.logout = (req, res) => {
    // Delete user of Session DB
    req.session.destroy(() => {
        res.redirect('/')
    });
};
