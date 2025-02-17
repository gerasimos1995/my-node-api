const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { registerValidator, loginValidator } = require("../util/validators.js");
const {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
  refreshTokenValidity,
} = require("../util/jwt.js");

const Logger = require("../util/logger");

// Importing the model
const userModel = require("../models/user.js");
const tokenModel = require("../models/token.js");

router.post("/register", async (req, res) => {
  try {
    // Data validation
    const { error } = await registerValidator(req.body);
    if (error) {
      Logger.info(error);
      return res.status(400).json({ message: error.details[0].message });
    }

    // Checking if the user is already registered
    const emailExists = await userModel.findOne({ email: req.body.email });
    if (emailExists) {
      Logger.info("User is already registered");
      return res.status(400).json({ message: "User already exists" });
    }

    // Checking if username is already in use
    const usernameAlreadyInUse = await userModel.findOne({
      username: req.body.username,
    });
    if (usernameAlreadyInUse) {
      Logger.info("Username already in use");
      return res.status(400).json({ message: "Username already in use" });
    }

    // Encrypting provided password
    var salt = await bcrypt.genSalt(10);
    var hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new userModel({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      role: req.body.role,
    });

    const savedUser = await user.save();
    // Not returning the hashed password as best practise
    res.status(201).send({
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
    });

    // New user so make a refresh token and persist it
    const temp_user = { username: savedUser.username };
    const refreshToken = generateRefreshToken(temp_user);
    const refresh_token_db = new tokenModel({
      token: refreshToken,
      username: temp_user.username,
    });
    await refresh_token_db.save();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Error occured while saving user: ${error}` });
  }
});

router.post("/login", refreshTokenValidity, async (req, res) => {
  try {
    // Data validation
    const { error } = await loginValidator(req.body);
    if (error) {
      Logger.info(error);
      return res.status(400).json({ message: error.details[0].message });
    }

    // Checking if the user exists
    const user = await userModel.findOne({ username: req.body.username });
    if (!user) {
      Logger.info("user doesn't exist");
      return res.status(400).json({ message: "User doesn't exist" });
    }

    // Checking if the password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      Logger.info("Password given in login was invalid");
      return res.status(400).json({ message: "Incorrect Password" });
    }

    // Get the valid refresh token from middleware
    // Issue a new access token
    const valid_refresh = req.refreshToken;
    const temp_user = {
      username: user.username,
      role: user.role,
      id: user._id,
    };
    access_token = generateAccessToken(temp_user);

    // Saving the refresh token created in the database along with the username of user
    res
      .header("Authorization", `Bearer ${access_token}`)
      .json({ AccessToken: access_token, RefreshToken: valid_refresh });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: error });
  }
});

// Creating new access token from a valid refresh token
router.post("/token", async (req, res, next) => {
  var refreshToken = req.body.refreshToken;
  if (refreshToken == null) {
    Logger.info("No refresh token provided");
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    var decoded = jwt.decode(refreshToken);
  } catch (error) {
    Logger.info("The refresh token provided could not be decoded");
    return res
      .status(400)
      .json({ message: "Refresh token provided was invalid" });
  }

  try {
    // Find if the access token provided by user has an active refresh token in database
    const rfrsh_tk = await tokenModel.findOne({ username: decoded.username });

    // There is no refresh token in the database for user
    if (!rfrsh_tk) {
      Logger.error("No refresh token found");
      return res
        .status(403)
        .json({ message: "There is no refresh token issued to this user" });
    }

    if (rfrsh_tk.token != req.body.refreshToken) {
      Logger.error("Refresh token given doesn't match with the one in db");
      return res
        .status(403)
        .json({
          message:
            "The refresh token you provided does not correspond to the one found in database",
        });
    }
    // There is a refresh token in db, verify it and then generate a new access token
    jwt.verify(
      rfrsh_tk.token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, user) => {
        if (err) {
          Logger.error(err);
          return res
            .status(403)
            .json({ message: "Error while verifying refresh token" });
        }
        // User has valid refresh token issued to him so we can create a new access token
        const temp_user = {
          username: decoded.username,
          role: decoded.role,
          id: user.id,
        };
        const accessToken = generateAccessToken(temp_user);
        if (!accessToken) {
          Logger.error("Error creating access token");
          return res
            .status(500)
            .json({ message: "Error creating access token" });
        }
        return res.status(201).json({ AccessToken: accessToken });
      }
    );
  } catch (error) {
    Logger.error(error);
    if (error.message == "Cannot read property 'username' of null") {
      return res
        .status(400)
        .json({
          message: "The provided token didn't match any in the database",
        });
    } else {
      return res
        .status(500)
        .json({ message: "Server error during token generation" });
    }
  }
});

// Deleting a refresh token from the database
router.post("/token/disable", async function (req, res, next) {
  const refreshToken = req.body.refreshToken;

  try {
    const rfrsh_tk = await tokenModel.deleteOne({ token: refreshToken });
    Logger.info("Deleted token" + rfrsh_tk);
    res.sendStatus(204);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(500);
  }
});

//
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const token = await tokenModel.deleteOne({ username: req.user.username });
    Logger.info(token);
    res.sendStatus(204);
  } catch (error) {
    Logger.error(error);
    res
      .status(400)
      .json({ message: "Could not find a refresh token issued to this user" });
  }
});
module.exports = router;
