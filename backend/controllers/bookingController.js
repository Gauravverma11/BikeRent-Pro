const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const PricingService = require('../services/pricingService');
const BookingService = require('../services/bookingService');
const PaymentService = require('../services/paymentService');

exports.createBooking = catchAsync(async (req, res, next) => {
    const { vehicleId, startTime, endTime, walletBalanceUsed, couponCode } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return next(new AppError('Vehicle not found', 404));

    // 0.1 KYC Validation
    if (req.user.kycStatus !== 'Verified') {
        return next(new AppError('Please complete your KYC verification before booking.', 403));
    }

    // 0.2 Overlapping Booking Validation
    const overlapBooking = await Booking.findOne({
        vehicleId,
        status: { $in: ['paid', 'active'] },
        $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gt: startTime } }
        ]
    });

    if (overlapBooking) {
        return next(new AppError('Vehicle is already booked for the selected dates.', 409));
    }

    // 1. Coupon Validation (Initial Check)
    let coupon = null;
    if (couponCode) {
        const Coupon = require('../models/Coupon');
        coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });

        if (!coupon || !coupon.isValid()) {
            return next(new AppError('Invalid or expired coupon code', 400));
        }

        if (req.user.usedCoupons && req.user.usedCoupons.includes(coupon._id)) {
            return next(new AppError('You have already used this coupon code', 400));
        }
    }

    // 2. Pricing Engine
    const pricing = await PricingService.calculatePrice(
        vehicle,
        startTime,
        endTime,
        req.user.walletBalance >= walletBalanceUsed ? walletBalanceUsed : 0,
        coupon
    );

    // 3. Transaction for Double Booking Prevention & Coupon Tracking
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const booking = await BookingService.createBooking({
            userId: req.user._id,
            vehicleId,
            startTime,
            endTime,
            ...pricing,
            couponId: coupon?._id,
            status: 'pending'
        }, session);

        // 4. Mark Coupon as Used in User Model
        if (coupon) {
            const User = require('../models/User');
            await User.findByIdAndUpdate(req.user._id, {
                $addToSet: { usedCoupons: coupon._id }
            }, { session });

            // Increment usage count on coupon
            coupon.usageCount += 1;
            await coupon.save({ session });
        }

        // 5. Create Razorpay Order
        const order = await PaymentService.createOrder(booking._id, pricing.finalAmount);

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            status: 'success',
            data: {
                booking,
                razorpayOrder: order
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return next(error);
    }
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find({ userId: req.user._id }).populate('vehicleId').sort('-createdAt');
    res.status(200).json({ status: 'success', data: { bookings } });
});

exports.returnBike = catchAsync(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return next(new AppError('Booking not found', 404));

    if (booking.status !== 'active' && booking.status !== 'paid') {
        return next(new AppError('Bike is not currently active', 400));
    }

    booking.actualEndTime = new Date();
    booking.status = 'completed';

    // Calculate late fines
    const expectedEnd = new Date(booking.endTime);
    if (booking.actualEndTime > expectedEnd) {
        const diffHours = Math.ceil((booking.actualEndTime - expectedEnd) / (1000 * 60 * 60));
        // Assuming Rs. 100 penalty per extra hour
        booking.lateReturnFine = diffHours * 100;
    }

    // Security Deposit calculation
    let refundAmount = booking.securityDeposit - booking.lateReturnFine;
    if (refundAmount < 0) refundAmount = 0; // if fine exceeds deposit
    booking.securityDepositRefunded = true; // Mark as processed

    // NOTE: In production, trigger Razorpay Refund API here for `refundAmount` if > 0

    await booking.save();

    res.status(200).json({
        status: 'success',
        data: {
            booking,
            refundAmount,
            message: `Bike returned successfully. Refund amount: ₹${refundAmount}`
        }
    });
});

exports.getActiveBookings = catchAsync(async (req, res, next) => {
    const activeBookings = await Booking.find({ status: { $in: ['paid', 'active'] } })
        .populate('vehicleId')
        .populate('userId', 'name email phone')
        .sort('endTime');

    res.status(200).json({ status: 'success', data: { bookings: activeBookings } });
});
