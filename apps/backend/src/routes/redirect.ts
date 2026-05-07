import { Router, Request, Response, NextFunction } from 'express';
import * as urlService from '../services/urlService.js';

const router = Router();

// Note: api-route-naming rule is disabled for this file via .eslintrc override
router.get('/:code', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await urlService.findByCode(req.params.code);
    if (!record) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    await urlService.incrementClicks(req.params.code);
    res.redirect(302, record.originalUrl);
  } catch (err) {
    next(err);
  }
});

export default router;
