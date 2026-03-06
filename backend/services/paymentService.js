const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const User = require('../models/User');
const AppError = require('../utils/appError');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

class PaymentService {
    static async createOrder(bookingId, amount) {
        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${bookingId}`,
        };

        const order = await razorpay.orders.create(options);

        await Payment.create({
            bookingId,
            razorpayOrderId: order.id,
            status: 'pending'
        });

        return order;
    }

    static async verifyWebhook(body, signature) {
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(JSON.stringify(body))
            .digest('hex');

        if (signature !== expectedSignature) {
            throw new AppError('Invalid webhook signature', 400);
        }

        const { event, payload } = body;

        if (event === 'payment.captured') {
            const orderId = payload.payment.entity.order_id;
            const paymentId = payload.payment.entity.id;

            const payment = await Payment.findOneAndUpdate(
                { razorpayOrderId: orderId },
                {
                    status: 'captured',
                    razorpayPaymentId: paymentId,
                    razorpaySignature: signature // In actual webhook, signature is in headers
                },
                { new: true }
            );

            if (payment) {
                const booking = await Booking.findByIdAndUpdate(
                    payment.bookingId,
                    { status: 'paid' },
                    { new: true }
                );

                // Handle Referral Rewards on first successful booking
                await this.handleReferralRewards(booking.userId);
            }
        }
    }

    static async handleReferralRewards(userId) {
        const user = await User.findById(userId);
        if (user && user.referredBy && !user.isReferralRewarded) {
            // Reward New User
            user.walletBalance += 50;
            user.isReferralRewarded = true;
            await user.save();

            // Reward Referrer
            await User.findByIdAndUpdate(user.referredBy, {
                $inc: { walletBalance: 100 }
            });
        }
    }
}

module.exports = PaymentService;
