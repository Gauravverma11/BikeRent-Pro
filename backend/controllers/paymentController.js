const PaymentService = require('../services/paymentService');
const catchAsync = require('../utils/catchAsync');

exports.razorpayWebhook = catchAsync(async (req, res, next) => {
    const signature = req.headers['x-razorpay-signature'];

    // Securely verify and handle webhook
    await PaymentService.verifyWebhook(req.body, signature);

    res.status(200).json({ status: 'ok' });
});
