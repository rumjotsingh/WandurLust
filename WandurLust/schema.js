const Joi = require('joi');
module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        country:Joi.string().required(),
        location:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null)
    }).required()
})
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
});

module.exports.bookingSchema = Joi.object({
    checkIn: Joi.date().required().min('now'),
    checkOut: Joi.date().required().greater(Joi.ref('checkIn')),
    guests: Joi.number().required().min(1).max(20)
});

module.exports.messageSchema = Joi.object({
    receiverId: Joi.string().required(),
    listingId: Joi.string().allow('', null),
    subject: Joi.string().max(200),
    message: Joi.string().required().min(1).max(2000)
});