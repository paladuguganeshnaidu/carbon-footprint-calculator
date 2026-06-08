import winston from 'winston';

const { combine, timestamp, json, colorize, printf, errors } = winston.format;

// Define clean console log format for developer visibility
const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${message}${stack ? `\n${stack}` : ''}`;
  })
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  ),
  transports: [
    // Write error logs to errors.log
    new winston.transports.File({ 
      filename: 'logs/errors.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Write all combined logs to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// If in development or fallback configuration, log to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
} else {
  // Add a basic console log in production with JSON formatting
  logger.add(new winston.transports.Console({
    format: combine(timestamp(), json())
  }));
}
