const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    if (user.password) user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user }
    });
};

exports.requestSignupOTP = catchAsync(async (req, res, next) => {
    const { name, email } = req.body;

    // 1) Check if user exists and is fully registered
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isRegistrationComplete) {
        return next(new AppError('A user with this email already exists!', 400));
    }

    // 2) Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const signupOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 3) Create or Update pending user
    if (existingUser) {
        existingUser.name = name;
        existingUser.signupOTP = otp;
        existingUser.signupOTPExpires = signupOTPExpires;
        await existingUser.save({ validateBeforeSave: false });
    } else {
        await User.create({
            name,
            email,
            signupOTP: otp,
            signupOTPExpires,
            isRegistrationComplete: false
        });
    }

    // 4) Send OTP
    try {
        await sendEmail({
            email,
            subject: 'Verification Code for BikeRent signup',
            message: `Your verification code is ${otp}. It is valid for 10 minutes.`
        });

        res.status(200).json({
            status: 'success',
            message: 'OTP sent to email!'
        });
    } catch (err) {
        console.error('Signup OTP Error:', err);
        return next(new AppError('Error sending email. Please try again later.', 500));
    }
});

exports.verifySignupOTP = catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;

    const user = await User.findOne({
        email,
        signupOTP: otp,
        signupOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Invalid or expired OTP', 400));
    }

    user.isVerified = true;
    user.signupOTP = undefined;
    user.signupOTPExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'Email verified! You can now set your password.'
    });
});

exports.signup = catchAsync(async (req, res, next) => {
    const { email, password, referralCode } = req.body;

    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
        return next(new AppError('Please verify your email first', 400));
    }

    if (user.isRegistrationComplete) {
        return next(new AppError('Registration already complete', 400));
    }

    // Handle Referral
    const finalReferralCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    let referredByUser = null;
    if (referralCode) {
        referredByUser = await User.findOne({ referralCode });
    }

    user.password = password;
    user.referralCode = finalReferralCode;
    user.referredBy = referredByUser ? referredByUser._id : undefined;
    user.isRegistrationComplete = true;

    await user.save();

    createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    const user = await User.findOne({ email, isRegistrationComplete: true }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, res);
});
