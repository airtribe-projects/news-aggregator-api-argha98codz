const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Please enter a valid email address.',
            'string.empty': 'Email cannot be empty.',
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters long.',
            'string.empty': 'Password cannot be empty.',
        }),
    });
    return schema.validate(data);
};

module.exports = { registerValidation };
