const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const Users = require('../models/user');
const Tokens = require('../models/token');
const Products = require('../models/product');

var token = null;
var decoded_user = null;

beforeAll(async (done) => {
    // Deleting all users registered in test db so tests can run as expected
     await Users.deleteMany();
     await Tokens.deleteMany();
     await Products.deleteMany();
     done();
 });

it("Should register user as shop_owner", async () => {
    const data = {
        username: "IamAshopOwner",
        password: "123456789",
        email: "thisisashopowener@gmail.com",
        role: "shop_owner"
    }
    const res = await request.post('/api/auth/register').send(data);
    expect(res.statusCode).toBe(201);
    // Check if returned id from request is a valid mongo object
    expect(mongoose.isValidObjectId(res.body.id)).toBe(true);
});

it("Should log in user", async () => {
    data = {
        username: "IamAshopOwner",
        password: "123456789"
    }
    const res = await request.post('/api/auth/login').send(data);
    token = res.body.AccessToken;
    expect(res.status).toBe(200);
    jwt.verify(res.body.AccessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        expect(decoded.username).toBe(data.username);
        decoded_user = decoded;
        //console.log(decoded_user);
    });
});

it("Should create a new product if user has rights to", async () => {
    data = {
        category: "New Category",
        title: "SuperSuperAwesomeProduct",
        price: "6436",
        provider: "Somebody"
    }
    console.log(`Bearer ${token}`)
    const res = await request
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
    console.log(res.body);
    expect(res.statusCode).toBe(201);
});