import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/error.js';
import { env } from './config/env.js';
import type { Request, Response } from 'express';

const app = express();

app.use(cors({
  origin: env.CORS_ORIGIN || true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (_req: Request, res: Response) => {
  res.json({ name: 'mindful-mentor-backend', status: 'ok' });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
