function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

const port = Number(process.env.PORT ?? 5000);
if (!Number.isInteger(port) || port <= 0) {
  throw new Error(`PORT must be a positive number, got "${process.env.PORT}"`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port,
  logLevel: process.env.LOG_LEVEL ?? 'info',
  mongodbUri: required('MONGODB_URI'),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
};
