const express = require('express');
const cors = require('cors');
const app = express();

const { db_connect } = require('./db_connection');

db_connect();

app.use(cors()); // to avoid cors issue 
app.use(express.json()); // body-parser for json
app.use(express.urlencoded({ extended: true })); // body-parser for xwww-form-urlencoded
var multer = require('multer');
var upload = multer();
app.use(upload.array());  // body-parser for form-data

// Route middlewares
const authentication = require('./routes/auth.js');
app.use('/api/auth', authentication);

const users = require('./routes/users.js');
app.use('/api/users', users);

const products = require('./routes/products.js');
app.use('/api/products', products);

const orders = require('./routes/orders.js');
app.use('/api/orders', orders);

module.exports = app