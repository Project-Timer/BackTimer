//VALIDATION
const Joi = require('@hapi/joi');

//register Validation
const registerValidation = data => {
    const schema = {
        lastname: Joi.string().required().error(new Error('Please insert a name ')),
        name: Joi.string().required().error(new Error('Please insert a pseudonym ')),
        email: Joi.string().min(8).required().email().error(new Error('Please insert a valid email')),
        password: Joi.string().min(8).required().error(new Error('Please insert a password of more than 6 characters'))
    };
    return Joi.validate(data, schema);
};

const loginValidation = data => {
    const schema = {
        email: Joi.string().min(8).required().email().error(new Error('PLease insert a valid email')),
        password: Joi.string().min(8).required().error(new Error('PLease insert a valid password'))
    }
    return Joi.validate(data, schema);
}

const groupValidation = data => {
    const schema = {
        name: Joi.string().required().error(new Error('Please insert a name for your group')),
        admin: Joi.string().required().error(new Error('The group must have an administrator')),
    };
    return Joi.validate(data, schema);
};

module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;
module.exports.groupValidation = groupValidation;
