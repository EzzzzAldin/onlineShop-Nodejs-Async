//  Init Dotenv
require('dotenv').config();

const express = require('express');
const path =  require('path');
const hbs = require('hbs');

// Require Session
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
// Routers
const homeRouter = require('./routes/home.route');
const productRouter = require('./routes/product.route');
const authRouter = require('./routes/auth.route');
const cartRouter = require('./routes/cart.route');
const orderRouter = require('./routes/order.route');
const adminRouter = require('./routes/admin.route');
// Server
const app = express();

// Init Static Files
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'images')));
// Init Flash Sessions
app.use(flash())
// Init Session Store
const STORE = new SessionStore({
    uri: process.env.DB_URI,
    collection: 'sessions'
});
app.use(session({
    secret: 'Naruto and luffy and ichego and medoria and gon and ocuby and many chatcter the best hero',
    saveUninitialized: false,
    store: STORE
}));

// Init Templet engin
app.set('view engine', 'hbs');
app.set('views', 'views');

hbs.registerHelper('itemsPrice', function() {
    return this.price * this.amount
});

// Port Init
const PORT = process.env.PORT || 3000;

// Router Use
app.use('/', homeRouter);
app.use('/', authRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/', orderRouter);
app.use('/admin', adminRouter);

app.get('/error', (req, res) => {
    res.status(500);
    res.render('error', {
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin
    })
});

app.get('/emailerr', (req, res) => {
    res.render('emailerr', {
        pageTitle: 'Emaile Error'
    })
});

app.get('/not-admin', (req, res) => {
    res.status(403)
    res.render('not-admin', {
        isUser: req.session.userId,
        isAdmin: false
    });
});

app.listen(PORT, () => {
    console.log(`Server run on Port ${PORT}`);
});