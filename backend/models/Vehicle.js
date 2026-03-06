const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vehicle name is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['EV', 'Petrol'],
        required: [true, 'Vehicle type is required']
    },
    basePricePerHour: {
        type: Number,
        required: [true, 'Base price per hour is required']
    },
    weekendMultiplier: {
        type: Number,
        default: 1.2
    },
    surgeMultiplier: {
        type: Number,
        default: 1
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        index: true
    },
    area: {
        type: String,
        required: [true, 'Area is required'],
        trim: true,
        index: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    maintenanceStatus: {
        type: String,
        enum: ['active', 'under-maintenance', 'retired'],
        default: 'active'
    },
    images: [{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
