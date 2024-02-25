const Joi = require('joi')
const joi = require('joi')

module.exports.listingSchema = Joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        image:joi.string().allow("",null),
        price:joi.number().min(0),
        location:joi.string(),
        country:joi.string()
    })
})


module.exports.ratingSchema = Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().required(),

    }).required()
})