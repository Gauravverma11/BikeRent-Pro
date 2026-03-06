const AppError = require('../utils/appError');

module.exports = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const message = error.details.map(i => i.message).join(',');
            return next(new AppError(message, 400));
        }
        next();
    };
};
