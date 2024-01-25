const app= require('./app');
const dotenv=require('dotenv');
const connectDaatabase= require('./config/database')

process.on('uncaughtException', err=>{
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down the server due to uncaught Exception.');
    process.exit(1)
})

//setting up config file
dotenv.config({path:'backend/config/config.env'});

//connecting to database
connectDaatabase();
const server= app.listen(process.env.PORT, ()=>{
    console.log(`Server Started on Port: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})
process.on('unhandledRejection', err=>{
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to unhandled Promise rejections.');
    server.close(()=>{
        process.exit(1);
    })
})