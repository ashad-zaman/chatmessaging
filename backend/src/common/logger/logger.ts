import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as winston from 'winston';

const logDir = process.env.LOG_DIR || 'logs';
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

const logLevel = process.env.LOG_LEVEL || 'info';
const nodeEnv = process.env.NODE_ENV || 'development';

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `[${timestamp}] [${context || 'App'}] ${level}: ${message} ${metaStr}`;
  }),
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json(),
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: consoleFormat,
    level: nodeEnv === 'production' ? 'warn' : logLevel,
  }),
];

export class Logger {
  private logger: winston.Logger;
  private contextValue: string;

  constructor(context: string = 'App') {
    this.contextValue = context;
    this.logger = winston.createLogger({
      level: logLevel,
      transports,
      defaultMeta: { service: 'chatmessaging', correlationId: randomUUID() },
    });
  }

  log(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, { context: this.contextValue, ...meta });
  }

  error(message: string, trace?: string, meta?: Record<string, unknown>): void {
    this.logger.error(message, { context: this.contextValue, trace, ...meta });
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, { context: this.contextValue, ...meta });
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, { context: this.contextValue, ...meta });
  }

  verbose(message: string, meta?: Record<string, unknown>): void {
    this.logger.verbose(message, { context: this.contextValue, ...meta });
  }

  setContext(context: string): void {
    this.contextValue = context;
  }
}

export const logger = new Logger();
