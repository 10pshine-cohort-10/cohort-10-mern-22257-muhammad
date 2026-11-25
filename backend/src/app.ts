import cors from 'cors';
import express, { Express } from 'express';
import { env } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';
import healthRoutes from './routes/health.routes';
import { httpLogger } from './utils/logger';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(httpLogger);
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: '1mb' }));

  app.use('/api/health', healthRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
