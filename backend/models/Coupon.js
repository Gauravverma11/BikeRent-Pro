const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please provide a coupon code'],
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        required: [true, 'Please specify discount type'],
        enum: ['percentage', 'fixed']
    },
    discountAmount: {
        type: Number,
        required: [true, 'Please provide discount amount']
    },
    minPurchase: {
        type: Number,
        default: 0
    },
    expiry: {
        type: Date,
        required: [true, 'Please provide expiry date']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number,
        default: null // null means unlimited
    },
    usageCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to check if coupon is valid based on date/status
couponSchema.methods.isValid = function () {
    return this.isActive && this.expiry > Date.now() && (this.usageLimit === null || this.usageCount < this.usageLimit);
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
