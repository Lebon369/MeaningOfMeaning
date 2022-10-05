const Joi = require('joi');

module.exports.portalDocumentJoiSchema = Joi.object({
    portalDocument: Joi.object({
        title: Joi.string().required(),
        author: Joi.string().required(),
        year: Joi.number().required().min(0),
        imageLink: Joi.string().required()
    }).required()
})