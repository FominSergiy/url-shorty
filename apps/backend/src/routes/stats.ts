import { Router, Request, Response, NextFunction } from 'express';
import * as urlService from '../services/urlService.js';

const router = Router();

router.get('/api/v1/stats/:code', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await urlService.getStats(req.params.code);
    if (!stats) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    res.json({
      code: stats.code,
      originalUrl: stats.originalUrl,
      clicks: stats.clicks,
      createdAt: stats.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
