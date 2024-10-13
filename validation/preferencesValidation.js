const Joi = require('joi');

const preferencesValidation = (data) => {
    const schema = Joi.object({
        categories: Joi.array().items(Joi.string()).min(1).required().messages({
            'array.min': 'At least one category is required.',
        }),
        languages: Joi.array().items(Joi.string().length(2)).min(1).required().messages({
            'array.min': 'At least one language is required.',
            'string.length': 'Language code must be 2 characters.',
        }),
    });
    return schema.validate(data);
};

module.exports = { preferencesValidation };
