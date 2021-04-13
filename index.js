const express = require('express');
const cors = require('cors');
const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { auth, requiresAuth } = require('express-openid-connect');

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

// Config dotenv file so it can be used below
dotenv.config();

// Auth0 middleware
app.use(
    auth({
        authRequired: false,
        auth0Logout: true,
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        secret: process.env.SECRET
    })
);

// Connection to db
try {
    mongoose.connect(process.env.LOCALHOST_DB,
        { useNewUrlParser: true }, () => {
             console.log("Connected to database successfully");
        });
} catch (error) {
    console.error("Failed to connect to database: ", error);
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

// Auth0 functionallity
// Another minor change
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Not authorized' );
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

app.listen(3000, () => {
    console.log('Server up and running');
});