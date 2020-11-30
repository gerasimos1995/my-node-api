const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { registerValidator, loginValidator } = require('../util/validators.js');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, authenticateToken } = require('../util/jwt.js');

// Importing the model
const userModel = require('../models/user.js');
const tokenModel = require('../models/token.js');

router.post('/register', async (req, res) => {
    try {
        // Data validation
        const { error } = await registerValidator(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message});

        // Checking if the user is already registered
        const emailExists = await userModel.findOne({ email: req.body.email });
        if (emailExists) return res.status(400).json({ message: "User already exists"});

        // Checking if username is already in use
        const usernameAlreadyInUse = await userModel.findOne({ username: req.body.username });
        if (usernameAlreadyInUse) return res.status(400).json({ message: "Username already in use"});

        // Encrypting provided password
        var salt = await bcrypt.genSalt(10);
        var hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new userModel({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            role: req.body.role
        });

        try {
            const savedUser = await user.save();
            // Not returning the hashed password as best practise
            res.status(201).send({
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong with saving user in database" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Error occured while saving user: ${err}` })
    }
});

router.post('/login', async (req, res) => {
    try {
        // Data validation
        const { error } = await loginValidator(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message});

        // Checking if the user exists
        const user = await userModel.findOne({ username: req.body.username });
        if (!user) return res.status(400).json({ message: "User doesn't exist" });

        // Checking if the password is correct
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Incorrect Password" });

        // Create the serializable object it could be simpler
        // const nuser = { id: user._id,
        //                 username: user.username,
        //                 email: user.email };
        const temp_user = { username: user.username, role: user.role, id: user._id };
        const access_token = generateAccessToken(temp_user);
        const refresh_token = generateRefreshToken(temp_user);
        if (!access_token || !refresh_token) return res.status(500).json({ message: "Error creating access/refresh tokens" });

        // Saving the refresh token created in the database along with the username of user
        try {
            const refresh_token_db = new tokenModel({
                token: refresh_token,
                username: temp_user.username
            });
            await refresh_token_db.save();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failure saving refresh token" });
        }
        res.header('Authorization', `Bearer ${access_token}`)
            .json({ AccessToken: access_token, RefreshToken: refresh_token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error });
    }
});

// Creating new access token from a valid refresh token
router.post('/token', async (req, res, next) => {
    var accessToken = req.body.accessToken;
    if (accessToken == null) return res.status(401).json({ message: "No access token provided"});
    
    const token = accessToken.split(' ')[1];
    var decoded = jwt.decode(token);
    console.log(decoded)
    try {
        // Find if the access token provided by user has an active refresh token in database
        const rfrsh_tk = await tokenModel.findOne({ username: decoded.username });
        
        // There is no refresh token in the database for user
        if (!rfrsh_tk) return  res.status(403).json({ message: "There is no refresh token issued to this user"});

        // if (rfrsh_tk.token != req.body.refreshToken) return res.status(403)
        //             .json({ message: "The refresh token you provided does not correspond to the one found in database" });
        // There is a refresh token in db, verify it and then generate a new access token
        jwt.verify(rfrsh_tk.token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: "Error while verifying refresh token"});
            // User has valid refresh token issued to him so we can create a new access token
            const temp_user = { username: decoded.username, role: decoded.role, id: user.id };
            const accessToken = generateAccessToken(temp_user);
            if (!accessToken) return res.status(500).json({ message: "Error creating access token" });
            return res.status(201).json({ AccessToken: accessToken });
        });
    } catch (error) {
        console.error(error);
        if (error.message == "Cannot read property 'username' of null"){ 
            return res.status(400).json({ message: "The provided token didn't match any in the database"});
        } else {
            return res.status(500).json({ message: "Server error during token generation" });
        }
    }
});

// Deleting a refresh token from the database
router.post('/token/disable', async function (req, res, next) {
    const refreshToken  = req.body.refreshToken;
        
    try {
        const rfrsh_tk = await tokenModel.deleteOne({ token: refreshToken });
        console.log("Deleted token: ", rfrsh_tk);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

// 
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        const token = await tokenModel.deleteOne({ username: req.user.username});
        console.log(token);
        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Could not find a refresh token issued to this user" });
    }
});
module.exports = router