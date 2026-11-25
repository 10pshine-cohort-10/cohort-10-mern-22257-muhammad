import { randomUUID } from 'node:crypto';
import pino from 'pino';
import { pinoHttp } from 'pino-http';
import { env } from '../config/env';

export const logger = pino({
  level: env.logLevel,
  redact: ['req.headers.authorization', 'req.headers.cookie'],
  transport: env.nodeEnv === 'development' ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
});

export const httpLogger = pinoHttp({
  logger,
  genReqId: () => randomUUID(),
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
});
