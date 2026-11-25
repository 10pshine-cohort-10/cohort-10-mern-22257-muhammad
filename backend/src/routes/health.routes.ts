import { Request, Response, Router } from 'express';
import { isDbConnected } from '../db/connect';
import { HealthResponse } from '../types';

const router = Router();

router.get('/', (_req: Request, res: Response<HealthResponse>) => {
  res.json({
    status: 'ok',
    database: isDbConnected() ? 'connected' : 'disconnected',
  });
});

export default router;
