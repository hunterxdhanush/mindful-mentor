# Mindful Mentor Backend

TypeScript + Express backend for the Mindful Mentor app.

## Tech Stack
- Express (Node.js)
- TypeScript (ESM, NodeNext)
- Zod for env validation
- CORS, Morgan

## Getting Started

1. Install dependencies
```bash
npm install
```

2. Configure environment
```bash
cp .env.example .env
# On Windows PowerShell
# Copy-Item .env.example .env
```
Adjust `PORT` and `CORS_ORIGIN` if needed. Default frontend is `http://localhost:8080`.

3. Run in development (watch mode)
```bash
npm run dev
```
Server starts at:
- http://localhost:5000/
- Health check: http://localhost:5000/api/health

4. Build and start (production)
```bash
npm run build
npm start
```

## Project Structure
```
src/
  index.ts            # server entry (app.listen)
  app.ts              # express app, middleware, routes mount
  config/env.ts       # env loading & validation (dotenv + zod)
  routes/index.ts     # /api routes
  middleware/
    notFound.ts
    error.ts
```

## Frontend Dev Proxy
`mindful-mentor-frontend/vite.config.ts` proxies `/api` to `http://localhost:5000` in dev.
