const Booking = require('../models/Booking');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');

class BookingService {
    /**
     * Check for overlapping bookings for a vehicle
     */
    static async checkOverlap(vehicleId, startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        const overlappingBooking = await Booking.findOne({
            vehicleId,
            status: { $ne: 'cancelled' },
            startTime: { $lt: end },
            endTime: { $gt: start }
        });

        return !!overlappingBooking;
    }

    /**
     * Create a new booking with race condition prevention
     */
    static async createBooking(bookingData, session) {
        const { vehicleId, startTime, endTime } = bookingData;
        const start = new Date(startTime);
        const end = new Date(endTime);

        // Re-check overlap within transaction to prevent race conditions
        const overlaps = await Booking.findOne({
            vehicleId,
            status: { $ne: 'cancelled' },
            startTime: { $lt: end },
            endTime: { $gt: start }
        }).session(session);

        if (overlaps) {
            throw new AppError('Vehicle is already booked for this time slot.', 400);
        }

        const booking = await Booking.create([bookingData], { session });
        return booking[0];
    }
}

module.exports = BookingService;
