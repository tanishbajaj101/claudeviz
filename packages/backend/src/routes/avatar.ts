import { Router } from 'express';
import type { Request, Response } from 'express';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';

const router = Router();

/**
 * GET /api/avatar
 * Generates an SVG avatar based on options provided in the query string.
 */
router.get('/', (req: Request, res: Response) => {
    try {
        const { seed, eyes, face, mouth, sides, top, texture, baseColor } = req.query;

        const avatar = createAvatar(bottts, {
            seed: (seed as string) || 'default-seed',
            eyes: eyes ? [eyes as any] : undefined,
            face: face ? [face as any] : undefined,
            mouth: mouth ? [mouth as any] : undefined,
            sides: sides ? [sides as any] : undefined,
            top: top ? [top as any] : undefined,
            texture: texture ? [texture as any] : undefined,
            baseColor: baseColor ? [baseColor as any] : undefined,
        });

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.send(avatar.toString());
    } catch (error) {
        console.error('[GET /api/avatar] Failed to generate avatar:', error);
        res.status(500).json({ error: 'Failed to generate avatar' });
    }
});

export default router;
