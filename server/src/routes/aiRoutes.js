import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { recommendServices } from '../controllers/aiController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { error: 'Too many planner requests. Please try again later.' },
});

router.post('/recommend-service', requireAuth, aiLimiter, recommendServices);

export default router;