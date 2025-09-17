import type { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = (err as any)?.statusCode || 500;
  const message = (err as any)?.message || 'Internal Server Error';
  const details = process.env.NODE_ENV !== 'production' ? (err as any)?.stack : undefined;

  res.status(status).json({ error: message, status, details });
}
