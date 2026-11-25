import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { ErrorResponse } from '../types';

// express.json() throws these with type 'entity.parse.failed' / 'entity.too.large'
function isBodyParserError(err: unknown): err is { status: number; type: string } {
  return typeof err === 'object' && err !== null && 'type' in err && 'status' in err;
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
    const message = err.type === 'entity.too.large' ? 'Request body is too large' : 'Request body is not valid JSON';
    sendError(res, err.status, message);
    return;
  }

  logger.error({ err, reqId: req.id }, 'Unhandled error');
  sendError(res, 500, 'Something went wrong. Please try again later.');
}
