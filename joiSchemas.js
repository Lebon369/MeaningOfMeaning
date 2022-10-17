const Joi = require('joi');

module.exports.portalDocumentJoiSchema = Joi.object({
    portalDocument: Joi.object({
        title: Joi.string().required(),
        author: Joi.string().required(),
        year: Joi.number().required().min(0),
        pages: Joi.number().required().min(0),
        imageLink: Joi.string().required()

    }).required()
})

module.exports.reviewJoiSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})