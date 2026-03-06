const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a user'],
        index: true
    },
    vehicleId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle',
        required: [true, 'Booking must belong to a vehicle'],
        index: true
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: Date,
        required: [true, 'End time is required']
    },
    hours: {
        type: Number,
        required: true
    },
    rentalAmount: {
        type: Number,
        required: true
    },
    gst: {
        type: Number,
        required: true
    },
    securityDeposit: {
        type: Number,
        required: true
    },
    finalAmount: {
        type: Number,
        required: true
    },
    couponId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Coupon'
    },
    couponDiscount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
    actualEndTime: {
        type: Date
    },
    lateReturnFine: {
        type: Number,
        default: 0
    },
    securityDepositRefunded: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
