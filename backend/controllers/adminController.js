const AnalyticsService = require('../services/analyticsService');
const catchAsync = require('../utils/catchAsync');

exports.getDashboardStats = catchAsync(async (req, res, next) => {
    const stats = await AnalyticsService.getDashboardStats();
    res.status(200).json({
        status: 'success',
        data: { stats }
    });
});
