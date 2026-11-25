import { createApp } from './app';
import { env } from './config/env';
import { connectDb, disconnectDb } from './db/connect';
import { logger } from './utils/logger';

async function start(): Promise<void> {
  try {
    await connectDb(env.mongodbUri);
  } catch (err) {
    logger.fatal({ err }, 'Could not connect to MongoDB');
    process.exit(1);
  }

  const server = createApp().listen(env.port, () => {
    logger.info(`Server listening on port ${env.port}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received, shutting down`);
    server.close();
    try {
      await disconnectDb();
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'Error while closing the database connection');
      process.exit(1);
    }
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

void start();
