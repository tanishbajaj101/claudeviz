/**
 * AI chat/coach routes
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { getChatResponse } from '../lib/chatbot.js';
import type { ChatRequest, ChatResponse } from '@algoarena/shared';

const router = Router();

/**
 * POST /api/chat
 * Get AI coach response for problem-solving assistance
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body as ChatRequest;
    const { message, problemContext } = body;

    if (!message || !problemContext) {
      res.status(400).json({ error: "Missing required fields: message, problemContext" });
      return;
    }

    const { reply, visualization } = await getChatResponse(
      message,
      problemContext
    );

    res.json({ reply, visualization } as ChatResponse);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
