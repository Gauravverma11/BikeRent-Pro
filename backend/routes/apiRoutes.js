const express = require('express');
const authController = require('../controllers/authController');
const vehicleController = require('../controllers/vehicleController');
const bookingController = require('../controllers/bookingController');
const paymentController = require('../controllers/paymentController');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const contactController = require('../controllers/contactController');
const couponController = require('../controllers/couponController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validatorMiddleware');
const schemas = require('../validators/schemas');
const multer = require('multer');
const path = require('path');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Multer Config
const storage = multer.memoryStorage(); // Switch to memory storage to process with sharp before saving

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});

// Rate Limiters
const otpLimiter = rateLimit({
    max: 3, // 3 requests
    windowMs: 60 * 60 * 1000, // per hour
    message: 'Too many OTP requests from this IP, please try again after an hour'
});

// AUTH
router.post('/auth/request-signup-otp', validate(schemas.requestSignupOTPSchema), authController.requestSignupOTP);
router.post('/auth/verify-signup-otp', validate(schemas.verifySignupOTPSchema), authController.verifySignupOTP);
router.post('/auth/signup', validate(schemas.completeSignupSchema), authController.signup);
router.post('/auth/login', validate(schemas.loginSchema), authController.login);

// USERS
router.get('/users/me', authMiddleware.protect, userController.getMe);
router.patch('/users/update-profile', authMiddleware.protect, userController.updateProfile);
router.patch('/users/update-avatar', authMiddleware.protect, upload.single('avatar'), userController.updateAvatar);
router.post('/users/request-password-otp', authMiddleware.protect, otpLimiter, userController.requestPasswordChangeOTP);
router.post('/users/change-password', authMiddleware.protect, userController.changePasswordWithOTP);
router.post('/users/rate-app', authMiddleware.protect, userController.rateApp);
router.post('/users/upload-kyc', authMiddleware.protect, upload.single('document'), userController.uploadKYC);
router.get('/users/pending-kyc', authMiddleware.protect, authMiddleware.restrictTo('admin'), userController.getPendingKYC);

// VEHICLES
router.get('/vehicles', authMiddleware.optionalProtect, vehicleController.getAllVehicles);
router.get('/vehicles/:id', vehicleController.getVehicle);
router.post('/vehicles', authMiddleware.protect, authMiddleware.restrictTo('admin'), validate(schemas.createVehicleSchema), vehicleController.createVehicle);

// BOOKINGS
router.use(authMiddleware.protect);
router.post('/bookings', validate(schemas.createBookingSchema), bookingController.createBooking);
router.get('/bookings/my', bookingController.getMyBookings);
router.get('/bookings/active', authMiddleware.restrictTo('admin'), bookingController.getActiveBookings);
router.post('/bookings/:id/return', authMiddleware.restrictTo('admin'), bookingController.returnBike);

// PAYMENTS
router.post('/payments/webhook', express.raw({ type: 'application/json' }), paymentController.razorpayWebhook);

// ADMIN
router.get('/admin/stats', authMiddleware.restrictTo('admin'), adminController.getDashboardStats);
router.patch('/admin/kyc/:id', authMiddleware.restrictTo('admin'), userController.adminApproveKYC);

// CONTACT
router.post('/contact', authMiddleware.protect, contactController.submitContactForm);

// COUPONS
router.get('/coupons', couponController.getAllCoupons);
router.post('/coupons/validate', authMiddleware.protect, couponController.validateCoupon);
router.post('/coupons', authMiddleware.protect, authMiddleware.restrictTo('admin'), couponController.createCoupon);

module.exports = router;
