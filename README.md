# cohort-10-mern-22257-muhammad
Cohort 10 — MERN (NodeJS+ReactJS) assignment for Muhammad Hassan Khan

A notes app where each user can sign up, log in and keep their own private notes with a rich text editor. The backend is Node + Express + TypeScript with MongoDB, the frontend is React + TypeScript.

This is still being built, so for now only the backend skeleton is here.

## Requirements

- Node.js 22.12 or newer
- MongoDB Community Server running locally on port 27017

## Running the backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell use `Copy-Item .env.example .env` instead of `cp`.

The API starts on http://localhost:5000. Check it with http://localhost:5000/api/health, which should return `{"status":"ok","database":"connected"}`.

### Environment variables

| Name | Example | What it's for |
|---|---|---|
| `PORT` | `5000` | Port the API listens on |
| `NODE_ENV` | `development` | Logs are pretty-printed in development only |
| `LOG_LEVEL` | `info` | Pino log level |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/notes_app` | MongoDB connection string. The database is created on first write |
| `CORS_ORIGIN` | `http://localhost:5173` | Where the frontend runs |

### Scripts

- `npm run dev` - start with auto reload
- `npm run build` - compile TypeScript to `dist/`
- `npm start` - run the compiled build
- `npm test` - run the Mocha tests (they don't need MongoDB running)
