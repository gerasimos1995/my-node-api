const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const Logger = require('../util/logger');
const Users = require('../models/user');
const Tokens = require('../models/token');

var token = null;
var decoded_user = null;

beforeAll(async (done) => {
    // Deleting all users registered in test db so tests can run as expected
     await Users.deleteMany();
     await Tokens.deleteMany();
     done();
 });

it("Should register user", async () => {
    const data = {
        username: "SomethingFunny2",
        password: "123456789",
        email: "thisisavalidemail2@gmail.com",
        role: "user"
    }
    const res = await request
        .post('/api/auth/register')
        .send(data);
    expect(res.statusCode).toBe(201);
    // Check if returned id from request is a valid mongo object
    expect(mongoose.isValidObjectId(res.body.id)).toBe(true);
});

it("Should log in user", async () => {
    data = {
        username: "SomethingFunny2",
        password: "123456789"
    }
    const res = await request
        .post('/api/auth/login')
        .send(data);
    token = res.body.AccessToken;
    expect(res.status).toBe(200);
    jwt.verify(res.body.AccessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        expect(decoded.username).toBe(data.username);
        decoded_user = decoded;
        //console.log(decoded_user);
    });
});

it("Should fail registering same user", async () => {
    const data = {
        username: "SomethingFunny2",
        password: "123456789",
        email: "thisisavalidemail2@gmail.com",
        role: "user"
    }
    const res = await request
        .post('/api/auth/register')
        .send(data);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
});

it ("Should return a new access token", async () => {
    try {
        //console.log("new: ", decoded_user);
        const refreshToken = await Tokens.findOne({ username: decoded_user.username });
        const res = await request
            .post('/api/auth/token')
            .send({
                refreshToken: refreshToken.token
            });
        expect(res.statusCode).toBe(201);
        //console.log(res.body);
    } catch (error){
        console.log(error);
    }
});

it("Should return an error message", async () => {
    const data = {
        username: "Somet",
        password: "1234",
        email: "thisisavalidemail2",
        role: "user46"
    }
    const res = await request
        .post('/api/auth/register')
        .send(data);
    expect(res.statusCode).toBe(400);
    //console.log(res.body.message);
});