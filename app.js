require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// inint Server
const app = express();




// DB connect
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
// Chack DB Is Connected
mongoose.connection.once('open', () => console.log('DB Is Connected'));


// MiddelWare
app.use(express.json());
app.use(cors());

// Routers
const adminRouter = require('./router/admin.route');
const authRouter = require('./router/auth.route');
const productRouter = require('./router/product.route');
const homeRouter = require('./router/home.route');
const cartRouter = require('./router/cart.route');
const orderRouter = require('./router/order.route');

// Port
const PORT = process.env.PORT || 5000;

// Use Routers
app.use('/api-onlineShop/admin', adminRouter);
app.use('/api-onlineShop', authRouter);
app.use('/api-onlineShop/product', productRouter);
app.use('/api-onlineShop', homeRouter);
app.use('/api-onlineShop', cartRouter);
app.use('/api-onlineShop', orderRouter);

app.listen(PORT, () => console.log(`Server Work to Port ${PORT}`));