const Joi = require('@hapi/joi');

const registerValidation = data => {
    const schema = {
        lastname: Joi.string().required().error(new Error('Please insert a last name ')),
        name: Joi.string().required().error(new Error('Please insert a name ')),
        email: Joi.string().min(8).required().email().error(new Error('Please insert a valid email')),
        password: Joi.string().min(8).required().error(new Error('Please insert a password of more than 8 characters'))
    };
    return Joi.validate(data, schema);
};

const loginValidation = data => {
    const schema = {
        email: Joi.string().min(8).required().email().error(new Error('Please insert a valid email')),
        password: Joi.string().min(8).required().error(new Error('Please insert a valid password'))
    }
    return Joi.validate(data, schema);
}
const updateUserValidation = data =>{
    const schema = {
        lastname: Joi.string().required().error(new Error('Please insert a name lastname')),
        name: Joi.string().required().error(new Error('Please insert a name ')),
        email: Joi.string().min(8).required().email().error(new Error('Please insert a valid email')),
    }
    return Joi.validate(data, schema);
}


module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;
module.exports.updateUserValidation = updateUserValidation;