const winston = require('winston');

// Define your custom format for structured logging
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
    winston.format.errors({ stack: true }), // Include stack trace for errors
    winston.format.splat(), // Handles string interpolation
    winston.format.json() // Output logs as JSON
);

// Create the logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Log level based on environment
    format: logFormat,
    transports: [
        // Console transport for development and local viewing
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // Colorize for better readability in console
                winston.format.simple() // Simple format for console (not JSON)
            ),
            silent: process.env.NODE_ENV === 'test' // Disable console logs during tests
        }),
        // File transport for production (JSON format)
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ],
    exceptionHandlers: [ // Catch uncaught exceptions
        new winston.transports.File({ filename: 'logs/exceptions.log' })
    ],
    rejectionHandlers: [ // Catch unhandled promise rejections
        new winston.transports.File({ filename: 'logs/rejections.log' })
    ]
});

// If not in production, also log to console in JSON for clarity
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json() // Full JSON logs in development console too (optional)
        ),
    }));
}

module.exports = logger;
