const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllVehicles = catchAsync(async (req, res, next) => {
    const filter = { isAvailable: true, maintenanceStatus: 'active' };

    // Prefix matching for city (case-insensitive) for type-ahead
    if (req.query.city && typeof req.query.city === 'string') {
        const escapedCity = req.query.city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.city = { $regex: new RegExp(`^${escapedCity}`, 'i') };
    }

    // Filtering by area (Case-insensitive exact match)
    if (req.query.area && typeof req.query.area === 'string') {
        const escapedArea = req.query.area.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.area = { $regex: new RegExp(`^${escapedArea}$`, 'i') };
    }

    if (req.query.type) filter.type = req.query.type;

    let vehicles = await Vehicle.find(filter);
    console.log(`Found ${vehicles.length} vehicles for filter:`, JSON.stringify(filter));

    // If user is logged in, check for current availability
    if (req.user) {
        try {
            const now = new Date();
            const activeBookings = await Booking.find({
                status: { $in: ['paid', 'pending'] },
                startTime: { $lte: now },
                endTime: { $gte: now }
            });

            const bookedVehicleIds = activeBookings.map(b => b.vehicleId.toString());
            console.log('Active Bookings Found:', activeBookings.length);

            vehicles = vehicles.map(vehicle => {
                const vehicleObj = vehicle.toObject();
                vehicleObj.isCurrentlyAvailable = !bookedVehicleIds.includes(vehicle._id.toString());
                return vehicleObj;
            });
        } catch (err) {
            console.error('Error in availability check:', err);
            // Don't fail the whole request just for availability check
        }
    }

    res.status(200).json({
        status: 'success',
        results: vehicles.length,
        data: { vehicles }
    });
});

exports.getVehicle = catchAsync(async (req, res, next) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return next(new AppError('No vehicle found with that ID', 404));

    res.status(200).json({
        status: 'success',
        data: { vehicle }
    });
});

exports.createVehicle = catchAsync(async (req, res, next) => {
    const newVehicle = await Vehicle.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { vehicle: newVehicle }
    });
});
