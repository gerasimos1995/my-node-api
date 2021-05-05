const joi = require('joi');
const { ROLES } = require('../models/role.js');

// registration validator
const registerValidator = (data) => {
    const schema = joi.object({
        username: joi.string().required().min(3).max(50),
        password: joi.string().required().min(8).max(250),
        email: joi.string().email().required().max(512),
        role: joi.string().valid(...Object.values(ROLES)).required()
    });

    return schema.validate(data);
}

const loginValidator = (data) => {
    const schema = joi.object({
        username: joi.string().required(),
        password: joi.string().required()       
    });

    return schema.validate(data);
}

const productValidator = (data) => {
    const schema = joi.object({
        category: joi.string().required(),
        title: joi.string().required(),
        price: joi.number().required(),
        provider: joi.string()
    });

    return schema.validate(data);
}

const orderValidator = (data) => {
    const schema = joi.object({
        //client: joi.string().hex().length(24)
        products: joi.array().items(joi.string().hex().length(24))
    })

    return schema.validate(data);
}

module.exports = {
    registerValidator,
    loginValidator,
    productValidator,
    orderValidator
}

//module.exports.registerValidator = registerValidator;
//module.exports.loginValidator = loginValidator;