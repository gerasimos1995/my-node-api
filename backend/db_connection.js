const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Logger = require('./util/logger');

// Connection to db
dotenv.config();

const db_connect = () => {
    try {
        mongoose.connect(process.env.LOCALHOST_DB,
            { 
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }, () => {
                Logger.info("Connected to database succesfully")
            });
    } catch (error) {
        Logger.error("Failed to connect to database" + error);
    }
}

module.exports = {
    db_connect
}
