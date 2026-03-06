const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vehicle = require('./models/Vehicle');

dotenv.config({ path: './.env' });

const vehicles = [
    {
        name: 'Ather 450X (Electric)',
        type: 'EV',
        basePricePerHour: 20, // 480/day
        city: 'Bangalore',
        area: 'Electronic City',
        images: ['https://images.unsplash.com/photo-1598209279122-8541213a0387?w=600'],
        isAvailable: true,
        maintenanceStatus: 'active'
    },
    {
        name: 'Royal Enfield Classic 350',
        type: 'Petrol',
        basePricePerHour: 35, // 840/day
        city: 'Bangalore',
        area: 'Jayanagar',
        images: ['https://images.unsplash.com/photo-1558981403-c5f97dbbe480?w=600'],
        isAvailable: true,
        maintenanceStatus: 'active'
    },
    {
        name: 'Ola S1 Pro (Electric)',
        type: 'EV',
        basePricePerHour: 18, // 432/day
        city: 'Delhi',
        area: 'Connaught Place',
        images: ['https://images.unsplash.com/photo-1594815550232-e615b7a44f33?w=600'],
        isAvailable: true,
        maintenanceStatus: 'active'
    },
    {
        name: 'Honda Activa 6G',
        type: 'Petrol',
        basePricePerHour: 15, // 360/day
        city: 'Delhi',
        area: 'Dwarka',
        images: ['https://images.unsplash.com/photo-1620939511593-3ea88d7ae391?w=600'],
        isAvailable: true,
        maintenanceStatus: 'active'
    },
    {
        name: 'KTM Duke 200',
        type: 'Petrol',
        basePricePerHour: 40, // 960/day
        city: 'Bangalore',
        area: 'Majestic',
        images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600'],
        isAvailable: true,
        maintenanceStatus: 'active'
    },
    {
        name: 'Royal Enfield Bullet 350',
        type: 'Petrol',
        basePricePerHour: 30, // 720/day
        city: 'Bangalore',
        area: 'Bommasandra',
        images: ['https://images.unsplash.com/photo-1589134716083-960114d87a55?w=600'],
        isAvailable: true,
        maintenanceStatus: 'active'
    },
    {
        name: 'Royal Enfield Meteor 350',
        type: 'Petrol',
        basePricePerHour: 38, // 912/day
        city: 'Delhi',
        area: 'Saket',
        images: ['https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=600'],
        isAvailable: true,
        maintenanceStatus: 'active'
    },
    {
        name: 'TVS Jupiter',
        type: 'Petrol',
        basePricePerHour: 12, // 288/day
        city: 'Bangalore',
        area: 'Electronic City',
        images: ['https://images.unsplash.com/photo-1610633857321-7294fd4ac577?w=600'],
        isAvailable: true,
        maintenanceStatus: 'active'
    },
    {
        name: 'Suzuki Access 125',
        type: 'Petrol',
        basePricePerHour: 14, // 336/day
        city: 'Delhi',
        area: 'Rohini',
        images: ['https://images.unsplash.com/photo-1598209278149-65f0f2950a97?w=600'],
        isAvailable: true,
        maintenanceStatus: 'active'
    }
];

const seedDB = async () => {
    try {
        const DB = process.env.DATABASE;
        await mongoose.connect(DB);
        console.log('Connected to DB for seeding...');

        await Vehicle.deleteMany();
        console.log('Existing vehicles cleared.');

        await Vehicle.insertMany(vehicles);
        console.log('Dummy data seeded successfully!');

        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedDB();
