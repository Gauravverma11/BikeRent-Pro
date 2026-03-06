const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Coupon = require('./models/Coupon');

dotenv.config({ path: './.env' });

const coupons = [
    {
        code: 'WELCOME50',
        discountType: 'percentage',
        discountAmount: 50,
        minPurchase: 500,
        expiry: new Date('2026-12-31'),
        isActive: true,
        usageLimit: null
    },
    {
        code: 'WEEKENDWALKER',
        discountType: 'fixed',
        discountAmount: 200,
        minPurchase: 1000,
        expiry: new Date('2026-12-31'),
        isActive: true,
        usageLimit: 100
    },
    {
        code: 'RIDEAGAIN',
        discountType: 'percentage',
        discountAmount: 20,
        minPurchase: 0,
        expiry: new Date('2026-12-31'),
        isActive: true,
        usageLimit: null
    }
];

const seedCoupons = async () => {
    try {
        const DB = process.env.DATABASE;
        await mongoose.connect(DB);
        console.log('Connected to DB for coupon seeding...');

        await Coupon.deleteMany();
        console.log('Existing coupons cleared.');

        await Coupon.insertMany(coupons);
        console.log('Coupons seeded successfully!');

        process.exit();
    } catch (err) {
        console.error('Error seeding coupons:', err);
        process.exit(1);
    }
};

seedCoupons();
