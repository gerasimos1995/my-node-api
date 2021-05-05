const Logger = require("./logger");
const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token");

// Auth Middlware
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      Logger.error("Error while verifying token: ", err.message);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Refresh Token validity
exports.refreshTokenValidity = async (req, res, next) => {
  try {
    const username = req.body.username;
    const db_token = await tokenModel.findOne({ username });
    if (!db_token) {
      return res.status(400).json({ message: "User doesn't exist" });
    }
    // Get token attribute of database token object and verify it
    jwt.verify(
      db_token.token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (user) {
          // If there is a valid refresh token just pass it through
          req.refreshToken = db_token.token;
          next();
        }
        // This is in case the verification of the refresh token fails
        if (err) {
          console.log(JSON.stringify(err));
          if (err.message == "jwt expired") {
            // Refresh token is valid but expired
            console.log("Refresh token expired. Issue a new one");
            const temp = { username: req.body.username };
            const refresh_token = this.generateRefreshToken(temp);

            // Persist the new token by updating the existing one
            db_token.token = refresh_token;
            await db_token.save();

            req.refreshToken = refresh_token;
            next();
          } else if (err.message == "invalid signature") {
            // Refresh token is invalid
            return res.status(400).json({
              message:
                "Refresh token provided had invalid signature. Contact administrator ",
            });
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed refresh token middleware" });
  }
};

// Roles Middleware
exports.roleAuthentication = (role) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];
    var decoded = jwt.decode(token);
    if (!role.includes(decoded.role)) {
      Logger.info("User didn't have permissions for this action");
      return res
        .status(401)
        .json({ message: "You do not have the permission for this action" });
    }
    next();
  };
  next();
};

// Helper function
exports.generateAccessToken = (user) => {
  try {
    // The token returned has all the user's information
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

exports.generateRefreshToken = (user) => {
  try {
    // The token returned has all the user's information
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1y",
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};
