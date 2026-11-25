import mongoose from 'mongoose';
import { logger } from '../utils/logger';

// Strips $-operators out of query filters, so a value like { "$gt": "" } can't sneak into a query
mongoose.set('sanitizeFilter', true);
mongoose.set('strictQuery', true);

export async function connectDb(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri);
    logger.info({ database: mongoose.connection.name }, 'Connected to MongoDB');
  } catch (err) {
    logger.error({ err }, 'Could not connect to MongoDB');
    throw err;
  }
}

export async function disconnectDb(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (err) {
    logger.error({ err }, 'Could not close the MongoDB connection');
    throw err;
  }
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === mongoose.ConnectionStates.connected;
}
