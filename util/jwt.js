const jwt = require('jsonwebtoken');

// Middlware
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log("Error while verifying token provided: ", err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

// Helper function
exports.generateAccessToken = (user) => {
    try {
        // The token returned has all the user's information
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s'});
    } catch (error) {
        console.error(error);
        return null;
        //return res.status(500).json({ error: error });
    }   
}

exports.generateRefreshToken = (user) => {
    try {
        // The token returned has all the user's information
        return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        console.error(error);
        return null;
        //return res.status(500).json({ error: error });
    }   
}
