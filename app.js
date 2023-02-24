const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const mongoose = require("mongoose")
mongoose.set('debug', true);

dotenv = require("dotenv")
console.log({env: process.env.NODE_ENV})
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config({ path: '.env.development' });
}
const passport = require('passport');
require('./config/auth/auth');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth-routes/auth-routes');
const shopRouter = require('./routes/shop')
const catelogBookRouter = require('./routes/catelog_book')
const catelogBookPageRouter = require('./routes/catelog_book_page')
const catelogBookItemRouter = require('./routes/catelog_book_page_item')
const vendorRouter = require('./routes/vendor')
const stockRouter = require('./routes/stock')
const orderRouter = require('./routes/order')
const newsRouter = require('./routes/news')
const categoryRoutes = require('./routes/category-route');


const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(__dirname + '/public'))

app.use('/v1/api', indexRouter);
app.use('/v1/api/auth', authRouter)
app.use('/v1/api/shop', shopRouter)
app.use('/v1/api/catelog/book', catelogBookRouter)
app.use('/v1/api/catelog/page', catelogBookPageRouter)
app.use('/v1/api/catelog/item', catelogBookItemRouter)
app.use('/v1/api/vendor', vendorRouter)
app.use('/v1/api/stock', stockRouter)
app.use('/v1/api/order', orderRouter)
app.use('/v1/api/news', newsRouter)
app.use('/v1/api/category', categoryRoutes);

const mongoUri = process.env.MONGO_URI

mongoose.set('strictQuery', false)
mongoose.connect(mongoUri)
    .then(() => {
        console.log("DB connection is ready")
    })
    .catch(err => {
        throw err
    })

module.exports = app;
