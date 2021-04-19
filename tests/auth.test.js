const supertest = require('supertest');
const app = require('../app');
const request = supertest(app)
const Logger = require('../util/logger');
const Users = require('../models/user');

beforeAll(async (done) => {
    // Deleting all users registered in test db so tests can run as expected
    await Users.deleteMany();
    done();
})

test('Should sign up for a user', async () => {
    await request.post('/api/auth/register').send({
            username: "SomethingFunny2",
            password: "123456789",
            email: "thisisavalidemail2@gmail.com",
            role: "user"
    }).expect(201)
})