const Booking = require('../models/Booking');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const mongoose = require('mongoose');

class AnalyticsService {
    static async getDashboardStats() {
        const totalUsers = await User.countDocuments({ role: 'user' });

        const revenueStats = await Booking.aggregate([
            { $match: { status: 'paid' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$finalAmount' },
                    totalBookings: { $sum: 1 }
                }
            }
        ]);

        const monthlyRevenue = await Booking.aggregate([
            { $match: { status: 'paid' } },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    revenue: { $sum: '$finalAmount' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        const mostRentedVehicle = await Booking.aggregate([
            { $match: { status: 'paid' } },
            {
                $group: {
                    _id: '$vehicleId',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 1 },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'vehicleDetails'
                }
            },
            { $unwind: '$vehicleDetails' }
        ]);

        return {
            totalUsers,
            totalRevenue: revenueStats[0]?.totalRevenue || 0,
            totalBookings: revenueStats[0]?.totalBookings || 0,
            monthlyRevenue,
            mostRentedVehicle: mostRentedVehicle[0] || null
        };
    }
}

module.exports = AnalyticsService;
