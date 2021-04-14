const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token');

// Auth Middlware
exports.authenticateToken = (req, res, next) => {
    //console.log("Hey i am in the auth middleware");
    const authHeader = req.headers['authorization'];
    
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log("Error while verifying token provided: ", err.message);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

// Refresh Token validity
exports.refreshTokenValidity = async (req, res, next) => {
    try {
        const username = req.body.username;
        const rtoken = await tokenModel.findOne({ username });

        jwt.verify(rtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            // this is in case the verification of the refresh token fails
            if (!user){
                console.log("Verification of refresh failed issuing a new one");
                const temp = {username: req.body.username}
                const refresh_token = this.generateRefreshToken(temp);
                req.refreshToken = refresh_token;
                next();
            }
            // if there is a valid refresh token just pass it through
            req.refreshToken = rtoken.token;
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({ message: "Failed refresh token middleware" });
    }
}

// Roles Middleware
exports.roleAuthentication = (role) => {
    return (req, res, next) => {
        //console.log("Hey i am in the role middleware");
        //console.log("Role required: ", role);
        const authHeader = req.headers['authorization'];
    
        const token = authHeader && authHeader.split(' ')[1];
        var decoded = jwt.decode(token);
        //console.log("Role of user: ", decoded.role);
        if (!role.includes(decoded.role)){
            return res.status(401).json({ message: "You do not have the permission for this action" });
        }
        next();
    }
}

// Helper function
exports.generateAccessToken = (user) => {
    try {
        // The token returned has all the user's information
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m'});
    } catch (error) {
        console.error(error);
        return null;
        //return res.status(500).json({ error: error });
    }   
}

exports.generateRefreshToken = (user) => {
    try {
        // The token returned has all the user's information
        return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1m'});
    } catch (error) {
        console.error(error);
        return null;
        //return res.status(500).json({ error: error });
    }   
}
