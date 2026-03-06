const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

try {
    const app = express();
    console.log('Express app initialized');

    const apiRouter = require('./routes/apiRoutes');
    console.log('API Router required');

    app.use('/api/v1', apiRouter);
    console.log('API Router applied to app');

    console.log('DIAGNOSTIC SUCCESS: Routes loaded correctly.');
} catch (err) {
    console.error('DIAGNOSTIC FAILURE:');
    console.error(err);
}
