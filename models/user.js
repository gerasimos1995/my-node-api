const { ROLES } = require('./roles.js');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 50
    },
    password: {
        type: String,
        required: true,
        max:512
    },
    email: {
        type: String,
        required: true,
        max: 512
    },
    firstname: {
        type: String,
        default: null,
        min: 1,
        max: 50
    },
    lastname: {
        type: String,
        default: null,
        min: 1,
        max: 50
    },
    age: {
        type: Number,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER],
        default: ROLES.USER
    }
});

module.exports = mongoose.model('User', userSchema);
// collection is users