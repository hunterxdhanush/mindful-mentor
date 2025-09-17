import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'mindful-mentor-backend' });
});

export default router;
