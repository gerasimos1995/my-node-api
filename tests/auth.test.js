const supertest = require('supertest');
const app = require('../app');
const request = supertest(app)
const Logger = require('../util/logger');
const Users = require('../models/user');
const Tokens = require('../models/token');

beforeAll(async (done) => {
    // Deleting all users registered in test db so tests can run as expected
    await Users.deleteMany();
    await Tokens.deleteMany();
    done();
});

describe("Register new user and try register him twice", () => {
    it("Should register user", async () => {
        await request
            .post('/api/auth/register')
            .send({
                username: "SomethingFunny2",
                password: "123456789",
                email: "thisisavalidemail2@gmail.com",
                role: "user"
            })
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it("Should fail registering same user", async () => {
        await request
            .post('/api/auth/register')
            .send({
                username: "SomethingFunny2",
                password: "123456789",
                email: "thisisavalidemail2@gmail.com",
                role: "user"
            })
            .expect(400)
    });
});
// test('Should sign up for a user', async () => {
//     await request.post('/api/auth/register').send({
//             username: "SomethingFunny2",
//             password: "123456789",
//             email: "thisisavalidemail2@gmail.com",
//             role: "user"
//     }).expect(201)
// });

// test('Should throw error trying to register a registered user', async () =>{
//     await request.post('/api/auth/register').send({
//         username: "SomethingFunny2",
//         password: "123456789",
//         email: "thisisavalidemail2@gmail.com",
//         role: "user"
//     }).end((err, res) => {
//         if (err) throw err;
//     })
// })