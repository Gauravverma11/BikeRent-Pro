const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
    // 1) Filter out unwanted fields that are not allowed to be updated
    const allowedFields = ['name', 'phone', 'dob', 'gender'];
    const filteredBody = {};
    Object.keys(req.body).forEach(el => {
        if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
    });

    // 2) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: { user: updatedUser }
    });
});

exports.requestPasswordChangeOTP = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    // 2) Generate the random 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP to store in DB
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    user.passwordResetOTP = hashedOTP;
    user.passwordResetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // 3) Send it back as an email
    const message = `Your password reset OTP is ${otp}. It is valid for 10 minutes.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset OTP (valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'OTP sent to email!'
        });
    } catch (err) {
        user.passwordResetOTP = undefined;
        user.passwordResetOTPExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
});

exports.changePasswordWithOTP = catchAsync(async (req, res, next) => {
    // 1) Get user based on token
    const hashedOTP = crypto.createHash('sha256').update(req.body.otp).digest('hex');

    const user = await User.findOne({
        email: req.user.email,
        passwordResetOTP: hashedOTP,
        passwordResetOTPExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('OTP is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordResetOTP = undefined;
    user.passwordResetOTPExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user (optional, if you have it)
    // 4) Log the user in, send JWT
    res.status(200).json({
        status: 'success',
        message: 'Password changed successfully!'
    });
});

exports.updateAvatar = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please upload an image!', 400));
    }

    const user = await User.findById(req.user.id);

    // Create new filename
    const filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    const uploadPath = path.join(__dirname, '../public/uploads', filename);

    // Process image with sharp: 
    // 1. Resize to 500x500
    // 2. Re-encode to JPEG (strips metadata, kills embedded scripts)
    // 3. Save to disk
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(uploadPath);

    // Delete old avatar if it exists
    if (user.avatar) {
        const oldFile = user.avatar.split('/').pop();
        const oldPath = path.join(__dirname, '../public/uploads', oldFile);
        if (fs.existsSync(oldPath)) {
            try {
                fs.unlinkSync(oldPath);
            } catch (err) {
                console.error('Error deleting old avatar:', err);
            }
        }
    }

    // Save relative path to DB
    user.avatar = `/uploads/${filename}`;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.rateApp = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (user.appRating > 0) {
        return next(new AppError('You have already rated the app!', 400));
    }

    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
        return next(new AppError('Please provide a valid rating between 1 and 5', 400));
    }

    user.appRating = rating;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'Thank you for your rating!',
        data: {
            appRating: user.appRating
        }
    });
});

exports.uploadKYC = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please upload a document image!', 400));
    }
    if (!req.body.documentType) {
        return next(new AppError('Please specify documentType!', 400));
    }

    const user = await User.findById(req.user.id);
    const filename = `kyc-${req.user.id}-${Date.now()}.jpeg`;
    const uploadPath = path.join(__dirname, '../public/uploads', filename);

    await sharp(req.file.buffer)
        .resize({ width: 800 })
        .toFormat('jpeg')
        .jpeg({ quality: 85 })
        .toFile(uploadPath);

    // If an old doc exists, try to delete it
    if (user.documentUrl) {
        const oldFile = user.documentUrl.split('/').pop();
        const oldPath = path.join(__dirname, '../public/uploads', oldFile);
        if (fs.existsSync(oldPath)) {
            try { fs.unlinkSync(oldPath); } catch (e) { }
        }
    }

    user.documentUrl = `/uploads/${filename}`;
    user.documentType = req.body.documentType;
    user.kycStatus = 'Pending';
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

exports.adminApproveKYC = catchAsync(async (req, res, next) => {
    const { kycStatus } = req.body;
    if (!['Verified', 'Rejected'].includes(kycStatus)) {
        return next(new AppError('Invalid status', 400));
    }

    const user = await User.findByIdAndUpdate(req.params.id, { kycStatus }, { new: true });
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

exports.getPendingKYC = catchAsync(async (req, res, next) => {
    const users = await User.find({ kycStatus: 'Pending', documentUrl: { $exists: true, $ne: '' } });
    res.status(200).json({
        status: 'success',
        data: { users }
    });
});

