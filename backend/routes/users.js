const express = require('express');
const router = express.Router();

const { authenticateToken, roleAuthentication } = require('../util/jwt.js');
const Logger = require('../util/logger');

// Importing the model
const userModel = require('../models/user.js');
const { ROLES } = require('../models/role.js');
const { loggers } = require('winston');

// Create new user entry
router.post('/', authenticateToken, roleAuthentication([ROLES.SUPERADMIN, ROLES.ADMIN]), async (req, res) => {
    const user = new userModel({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        address: req.body.address
    });

    try {
        const savedUser = await user.save();
        return res.status(201).send(savedUser);
    } catch (error) {
        Logger.error(error.message);
        return res.status(400).json({ message: error.message });
    }
});

//Get all users 
router.get('/', authenticateToken, roleAuthentication([ROLES.SUPERADMIN, ROLES.ADMIN]), async (req, res) => {
    try {
        const data = await userModel.find();
        return res.status(200).send(data);
    } catch (error) {
        Logger.error(error);
        return res.status(400).json({ message: "Something went wrong" });
    }
});

//Fetch user's own information
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const data = await userModel.findOne({_id : req.user.id});
        res.status(200).json({
            id: data._id,
            username: data.username,
            email: data.email,
            address: data.address,
            firstname: data.firstname,
            lastname: data.lastname,
            age: data.age
        });
    } catch (error) {
        Logger.error(error);
        res.status(400).json({ message: error });
    }
});

// Fetch specific user
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) return res.status(400).json({ message: "User not found"});

        res.status(200).send({
            requestedFrom: req.user,
            id: user._id,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        Logger.log(error);
        res.status(500).json({ message: error });
    }
});


module.exports = router;