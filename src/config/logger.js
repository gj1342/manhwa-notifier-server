import winston from 'winston';
import fs from 'fs';
import { NODE_ENV } from './env.js';
import { LOGGER_CONFIG } from './common.js';

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
      timestamp({ format: LOGGER_CONFIG.TIMESTAMP_FORMAT }),
      splat(),
      consoleFormat
    ),
    level: LOGGER_CONFIG.LEVEL_INFO,
  }),
];

if (NODE_ENV === LOGGER_CONFIG.PROD_ENV) {
  try {
    const dirProd = (LOGGER_CONFIG.PROD_LOG_COMBINED || '').split('/').slice(0, -1).join('/');
    if (dirProd) fs.mkdirSync(dirProd, { recursive: true });
  } catch {}
  transports.push(
    new winston.transports.File({
      filename: LOGGER_CONFIG.PROD_LOG_ERROR,
      level: LOGGER_CONFIG.LEVEL_ERROR,
      format: combine(timestamp(), json()),
    }),
    new winston.transports.File({
      filename: LOGGER_CONFIG.PROD_LOG_COMBINED,
      format: combine(timestamp(), json()),
    })
  );
} else {
  try {
    const dirDev = (LOGGER_CONFIG.DEV_LOG_COMBINED || '').split('/').slice(0, -1).join('/');
    if (dirDev) fs.mkdirSync(dirDev, { recursive: true });
  } catch {}
  transports.push(
    new winston.transports.File({
      filename: LOGGER_CONFIG.DEV_LOG_ERROR,
      level: LOGGER_CONFIG.LEVEL_ERROR,
      format: combine(timestamp(), splat(), fileFormat),
    }),
    new winston.transports.File({
      filename: LOGGER_CONFIG.DEV_LOG_COMBINED,
      format: combine(timestamp(), splat(), fileFormat),
    })
  );
}

const logger = winston.createLogger({
  level: NODE_ENV === LOGGER_CONFIG.PROD_ENV ? LOGGER_CONFIG.LEVEL_INFO : LOGGER_CONFIG.LEVEL_DEBUG,
  transports,
  exitOnError: false,
});

export default logger;
