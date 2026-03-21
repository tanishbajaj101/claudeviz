import { Router } from 'express';
import type { Request, Response } from 'express';
import { getCurrentBounty } from '../lib/bounty.js';

const router = Router();

/**
 * GET /api/bounty/current
 * Returns the currently active bounty problem, or { active: false } if none.
 * Public — no auth required.
 */
router.get('/current', (_req: Request, res: Response) => {
  const bounty = getCurrentBounty();
  if (!bounty) {
    res.json({ active: false });
    return;
  }
  res.json({ active: true, ...bounty });
});

export default router;
