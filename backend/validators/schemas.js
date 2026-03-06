const Joi = require('joi');

exports.requestSignupOTPSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required()
});

exports.verifySignupOTPSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required()
});

exports.completeSignupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    referralCode: Joi.string().optional().allow('')
}).unknown(true);

exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

exports.createVehicleSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('EV', 'Petrol').required(),
    basePricePerHour: Joi.number().min(0).required(),
    weekendMultiplier: Joi.number().min(1).default(1.2),
    surgeMultiplier: Joi.number().min(1).default(1),
    city: Joi.string().required(),
    images: Joi.array().items(Joi.string()).optional()
});

exports.createBookingSchema = Joi.object({
    vehicleId: Joi.string().required(),
    startTime: Joi.date().iso().required(),
    endTime: Joi.date().iso().greater(Joi.ref('startTime')).required(),
    walletBalanceUsed: Joi.number().min(0).default(0)
});
