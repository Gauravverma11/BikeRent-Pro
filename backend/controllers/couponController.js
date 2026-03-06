const Coupon = require('../models/Coupon');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all active coupons for the frontend offers page
exports.getAllCoupons = catchAsync(async (req, res, next) => {
    const coupons = await Coupon.find({
        isActive: true,
        expiry: { $gt: Date.now() }
    }).select('-usageCount -usageLimit -createdAt -__v');

    res.status(200).json({
        status: 'success',
        results: coupons.length,
        data: {
            coupons
        }
    });
});

// Validate a coupon (used during checkout/booking)
exports.validateCoupon = catchAsync(async (req, res, next) => {
    const { code, amount } = req.body;

    if (!code) {
        return next(new AppError('Please provide a coupon code', 400));
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon || !coupon.isValid()) {
        return next(new AppError('Invalid or expired coupon code', 400));
    }

    // Check if user already used this coupon
    if (req.user.usedCoupons && req.user.usedCoupons.includes(coupon._id)) {
        return next(new AppError('You have already used this coupon code', 400));
    }

    if (amount < coupon.minPurchase) {
        return next(new AppError(`Minimum purchase amount for this coupon is ₹${coupon.minPurchase}`, 400));
    }

    let finalDiscount = 0;
    if (coupon.discountType === 'percentage') {
        finalDiscount = (amount * coupon.discountAmount) / 100;
    } else {
        finalDiscount = coupon.discountAmount;
    }

    res.status(200).json({
        status: 'success',
        data: {
            code: coupon.code,
            discountType: coupon.discountType,
            discountAmount: coupon.discountAmount,
            appliedDiscount: finalDiscount,
            finalAmount: amount - finalDiscount
        }
    });
});

// Admin: Create a new coupon
exports.createCoupon = catchAsync(async (req, res, next) => {
    const newCoupon = await Coupon.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            coupon: newCoupon
        }
    });
});
