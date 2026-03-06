const AppError = require('../utils/appError');

class PricingService {
    /**
     * Calculate rental price based on vehicle and time
     */
    static async calculatePrice(vehicle, startTime, endTime, walletBalanceUsed = 0, coupon = null) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (end <= start) {
            throw new AppError('End time must be after start time', 400);
        }

        const diffInMs = end - start;
        const hours = Math.ceil(diffInMs / (1000 * 60 * 60));

        if (hours > 120) {
            throw new AppError('Rental duration cannot exceed 5 days (120 hours)', 400);
        }

        let totalBasePrice = hours * vehicle.basePricePerHour;

        // Weekend Check
        const isWeekend = (day) => day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
        let weekendFound = false;
        let tempDate = new Date(start);
        while (tempDate < end) {
            if (isWeekend(tempDate.getDay())) {
                weekendFound = true;
                break;
            }
            tempDate.setHours(tempDate.getHours() + 1);
        }

        if (weekendFound) {
            totalBasePrice *= vehicle.weekendMultiplier;
        }

        // Apply Surge
        totalBasePrice *= vehicle.surgeMultiplier;

        const gst = totalBasePrice * 0.18;
        const securityDeposit = 1000; // Fixed deposit or dynamic based on vehicle type

        let finalAmount = totalBasePrice + gst + securityDeposit;

        // 1. Apply Coupon Discount (Before Wallet)
        let couponDiscount = 0;
        if (coupon) {
            if (finalAmount < coupon.minPurchase) {
                throw new AppError(`Minimum purchase for this coupon is ₹${coupon.minPurchase}`, 400);
            }
            if (coupon.discountType === 'percentage') {
                couponDiscount = (finalAmount * coupon.discountAmount) / 100;
            } else {
                couponDiscount = coupon.discountAmount;
            }
            finalAmount -= couponDiscount;
        }

        // 2. Apply Wallet Discount (safely)
        const walletDiscount = Math.min(walletBalanceUsed, finalAmount * 0.5); // Max 50% from wallet
        finalAmount -= walletDiscount;

        return {
            hours,
            rentalAmount: totalBasePrice,
            gst,
            securityDeposit,
            couponDiscount,
            walletDiscount,
            finalAmount: Math.round(finalAmount * 100) / 100
        };
    }
}

module.exports = PricingService;
