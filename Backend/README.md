# SindhuSwap Backend

Production-ready Phase-1 backend foundation for SindhuSwap.

## Setup

```bash
cd Backend
npm install
cp .env.example .env
npm run dev
```

## Commands

```bash
npm run dev
npm start
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Server port |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRE` | JWT expiry, for example `7d` |
| `CLIENT_URL` | Frontend origin allowed by CORS |
| `COOKIE_SECRET` | Cookie parser secret |

## API Base URL

```text
http://localhost:5000/api/v1
```

## Auth Endpoints

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/admin/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

## Folder Structure

```text
src/
  config/
  constants/
  controllers/
  logs/
  middlewares/
  models/
  routes/
  services/
  uploads/
  utils/
  validators/
  app.js
  server.js
```
