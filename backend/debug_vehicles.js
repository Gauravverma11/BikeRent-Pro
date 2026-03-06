const mongoose = require('mongoose');
require('dotenv').config();
const Vehicle = require('./models/Vehicle');

async function debug() {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to DB');
        const vehicles = await Vehicle.find({});
        console.log(`Total vehicles: ${vehicles.length}`);
        vehicles.forEach(v => {
            console.log(`- ${v.name} | City: ${v.city} | Area: ${v.area} | Type: ${v.type} | Available: ${v.isAvailable} | Status: ${v.maintenanceStatus}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
