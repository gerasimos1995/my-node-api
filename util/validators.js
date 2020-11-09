const joi = require('joi');

// registration validator
const registerValidator = (data) => {
    const schema = joi.object({
        username: joi.string().required().min(3).max(50),
        password: joi.string().required().min(8).max(250),
        email: joi.string().email().required().max(512)
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

module.exports.registerValidator = registerValidator;
module.exports.loginValidator = loginValidator;