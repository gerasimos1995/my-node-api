const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { registerValidator, loginValidator } = require('../util/validators.js');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../util/jwt.js');

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
            email: req.body.email
        });

        const savedUser = await user.save();
        // Not returning the hashed password as best practise
        res.status(201).send({
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email
        });
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
        const nuser = { username: user.username };
        const access_token = generateAccessToken(nuser);
        const refresh_token = generateRefreshToken(nuser);
        console.log(access_token, "\n\n\n", refresh_token );
        try {
            const refresh_token_db = new tokenModel({
                token: refresh_token,
                username: nuser.username
            });

            await refresh_token_db.save();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failure saving refresh token" });
        }
        return res.header('Authorization', `Bearer ${access_token}`)
                .json({ AccessToken: access_token, RefreshToken: refresh_token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error });
    }
});

// Creating new access token from a valid refresh token
router.post('/token', async (req, res, next) => {
    var refreshToken = req.body.refreshToken;
    if (refreshToken == null) return res.status(401).json({ message: "No refresh token provided"});
    
    var decoded = jwt.decode(refreshToken);
    try {
        const rfrsh_tk = await tokenModel.findOne({ username: decoded.username });
        
        // There is no refresh token created for user
        if (!rfrsh_tk) return  res.status(403).json({ message: "There is no refrest token issued to this user"});

        jwt.verify(rfrsh_tk.token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: "Error while verifying refresh token"});
            // User has valid refresh token issued to him so we can create a new access token
            const accessToken = generateAccessToken(user);
            return res.json({ AccessToken: accessToken });
        });
    } catch (error) {
        console.error(error);
        if (error.message == "Cannot read property 'username' of null"){ 
            return res.status(400).json({ message: "The provided token didn't match any in the database"});
        } else {
            return res.status(500).json({ message: "Server error during token generatio" });
        }
    }
});

// Deleting a refresh token from the database
router.post('/token/disable', async function (req, res, next) {
    var refreshToken  = req.body.refreshToken;
    var decoded = jwt.decode(refreshToken);
    console.log(decoded);
    try {
        const rfrsh_tk = await tokenModel.deleteOne({ token: refreshToken });
        return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
})

module.exports = router