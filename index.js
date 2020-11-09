const express = require('express');
const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Middlewares
app.use(express.json()); //body-parser
//const authMiddleware = require('./util/jwt.js');

// Connection to db
dotenv.config();
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
app.use('/api/users', users); //authMiddleware,

app.listen(3000, () => {
    console.log('Server up and running');
});