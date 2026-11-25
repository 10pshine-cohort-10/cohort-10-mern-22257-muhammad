// Runs before any test file is loaded, so src/config/env.ts sees these values
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/notes_app_test';
