const express = require('express');
const cors = require('cors');
const app = express();

const Logger = require('./util/logger');

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Middlewares
// app.use((req, res, next) => {
//     console.log("Inside cors middlware");
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', '*');
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
//     next();
// }); 
app.use(cors()); // to avoid cors issue 
app.use(express.json()); // body-parser for json
app.use(express.urlencoded({ extended: true })); // body-parser for xwww-form-urlencoded
var multer = require('multer');
var upload = multer();
app.use(upload.array());  // body-parser for form-data

// Connection to db
dotenv.config();
try {
    mongoose.connect(process.env.LOCALHOST_DB,
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }, () => {
            Logger.info("Connected to database succesfully")
             //console.log("Connected to database successfully");
        });
} catch (error) {
    Logger.error(error)
    //console.error("Failed to connect to database: ", error);
}


// Route middlewares
const authentication = require('./routes/auth.js');
app.use('/api/auth', authentication);

const users = require('./routes/users.js');
app.use('/api/users', users);

const products = require('./routes/products.js');
app.use('/api/products', products);

const orders = require('./routes/orders.js');
app.use('/api/orders', orders);


app.listen(3000, () => {
    Logger.info("Server up and running on port 3000");
    //console.log('Server up and running');
});