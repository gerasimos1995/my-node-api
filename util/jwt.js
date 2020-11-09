const jwt = require('jsonwebtoken');

// Auth Middlware
exports.authenticateToken = (req, res, next) => {
    console.log("Hey i am in the auth middleware");
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

// Roles Middleware
exports.roleAuthentication = (role) => {
    return (req, res, next) => {
        console.log("Hey i am in the role middleware");
        console.log("Role required: ", role);
        const authHeader = req.headers['authorization'];
    
        const token = authHeader && authHeader.split(' ')[1];
        var decoded = jwt.decode(token);

        if (!role.includes(decoded.role)){
            res.status(401).json({ message: "You do not have the permission for this action" });
        }
        next();
    }
}

// Helper function
exports.generateAccessToken = (user) => {
    try {
        // The token returned has all the user's information
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m'});
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
