const Joi = require('@hapi/joi');

const userSchemaValidation = (data, a = true, b = true, c = true, d = true) => {
    (a) ? lastname = Joi.string().required().error(new Error('Please insert a last name ')) : lastname = null
    (b) ? name = Joi.string().required().error(new Error('Please insert a name ')) : name = null
    (c) ? email = Joi.string().min(8).required().email().error(new Error('Please insert a valid email')) : email = null
    (d) ? password = Joi.string().min(8).required().error(new Error('Please insert a password of more than 8 characters')) : password = null

    const schema = {
        lastname: lastname,
        name: name,
        email: email,
        password: password
    };
    return Joi.validate(data, schema);
};

module.exports.userSchemaValidation = userSchemaValidation;
