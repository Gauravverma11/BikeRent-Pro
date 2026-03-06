const express = require('express');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./middleware/errorMiddleware');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
// const limiter = rateLimit({
//     max: 100,
//     windowMs: 60 * 60 * 1000,
//     message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// CORS implementation
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// 2) ROUTES
const apiRouter = require('./routes/apiRoutes');
app.use('/api/v1', apiRouter);

// 3) HANDLING UNHANDLED ROUTES
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4) GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
