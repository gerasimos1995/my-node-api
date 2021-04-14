const Logger = require('./logger');
const jwt = require('jsonwebtoken');

// Auth Middlware
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            Logger.error("Error while verifying token: ", err.message);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

// Roles Middleware
exports.roleAuthentication = (role) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
    
        const token = authHeader && authHeader.split(' ')[1];
        var decoded = jwt.decode(token);
        if (!role.includes(decoded.role)){
            Logger.info("User didn't have permissions for this action");
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
    }   
}

exports.generateRefreshToken = (user) => {
    try {
        // The token returned has all the user's information
        return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        console.error(error);
        return null;
    }   
}
