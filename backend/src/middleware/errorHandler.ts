import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { ErrorResponse } from '../types';

// Error types set by body-parser (used by express.json()), with the message we want to show for each
const bodyParserMessages: Record<string, string> = {
  'entity.parse.failed': 'Request body is not valid JSON',
  'entity.too.large': 'Request body is too large',
  'charset.unsupported': 'Unsupported charset in Content-Type',
  'encoding.unsupported': 'Unsupported Content-Encoding',
};

interface BodyParserError {
  status: number;
  type: string;
}

function isBodyParserError(err: unknown): err is BodyParserError {
  if (typeof err !== 'object' || err === null) return false;
  const { status, type } = err as Partial<BodyParserError>;
  return typeof status === 'number' && typeof type === 'string';
}

function sendError(res: Response<ErrorResponse>, status: number, message: string): void {
  res.status(status).json({ error: { message, status } });
}

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    sendError(res, err.status, err.message);
    return;
  }

  if (isBodyParserError(err)) {
    sendError(res, err.status, bodyParserMessages[err.type] ?? 'Request body could not be read');
    return;
  }

  logger.error({ err, reqId: req.id }, 'Unhandled error');
  sendError(res, 500, 'Something went wrong. Please try again later.');
}
