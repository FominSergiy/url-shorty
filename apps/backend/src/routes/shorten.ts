import { Router, Request, Response, NextFunction } from 'express';
import * as urlService from '../services/urlService.js';

const router = Router();

router.post('/api/v1/shorten', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body as { url?: string };
    if (!url) {
      return res.status(400).json({ error: 'url is required' });
    }
    const record = await urlService.createUrl(url);
    const shortUrl = `${process.env.BASE_URL}/${record.code}`;
    res.status(201).json({ code: record.code, shortUrl });
  } catch (err) {
    next(err);
  }
});

export default router;
