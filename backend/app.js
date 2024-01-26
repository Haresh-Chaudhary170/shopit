const express= require('express');
const app= express();
const cookieParser= require('cookie-parser')
app.use(express.json());
app.use(cookieParser());
const errorMiddleware= require('./middlewares/error');

//IMPORTING ALL ROUTES
const products= require('./routes/product');
const auth= require('./routes/auth');
const order= require('./routes/order');

app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', order);

//error middlewares
app.use(errorMiddleware);

module.exports=app;