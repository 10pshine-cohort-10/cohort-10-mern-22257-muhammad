import mongoose from 'mongoose';
import { logger } from '../utils/logger';

// Strips $-operators out of query filters, so a value like { "$gt": "" } can't sneak into a query
mongoose.set('sanitizeFilter', true);
mongoose.set('strictQuery', true);

export async function connectDb(uri: string): Promise<void> {
  await mongoose.connect(uri);
  logger.info({ database: mongoose.connection.name }, 'Connected to MongoDB');
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
  logger.info('Disconnected from MongoDB');
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === mongoose.ConnectionStates.connected;
}
