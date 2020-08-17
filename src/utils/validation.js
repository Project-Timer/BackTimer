const Joi = require('@hapi/joi');

exports.userSchemaValidation = (
    data,
    a = true,
    b = true,
    c = true,
    d = true
) => {
    let lastname, name, email, password

    (a) ? lastname = Joi.string().required().error(new Error('Please insert a last name ')) : lastname = null;
    (b) ? name = Joi.string().required().error(new Error('Please insert a name ')) : name = null;
    (c) ? email = Joi.string().min(8).required().email().error(new Error('Please insert a valid email')) : email = null;
    (d) ? password = Joi.string().min(8).required().error(new Error('Please insert a password of more than 8 characters')) : password = null;

    const schema = {
        lastname: lastname,
        name: name,
        email: email,
        password: password
    };

    console.log(Joi.validate(data, schema))
    return Joi.validate(data, schema);
};