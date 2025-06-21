import winston from 'winston';
import { NODE_ENV } from './env.js';

const { combine, timestamp, printf, colorize, splat, json } = winston.format;

const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const fileFormat = printf(({ level, message, timestamp, stack }) => {
  const logMessage = {
    timestamp,
    level,
    message: stack || message,
  };
  return JSON.stringify(logMessage);
});

const transports = [
  new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      splat(),
      consoleFormat
    ),
    level: 'info',
  }),
];

if (NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(timestamp(), json()),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(timestamp(), json()),
    })
  );
} else {
  transports.push(
    new winston.transports.File({
      filename: 'logs/dev-error.log',
      level: 'error',
      format: combine(timestamp(), splat(), fileFormat),
    }),
    new winston.transports.File({
      filename: 'logs/dev-combined.log',
      format: combine(timestamp(), splat(), fileFormat),
    })
  );
}

const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  transports,
  exitOnError: false,
});

export default logger;
