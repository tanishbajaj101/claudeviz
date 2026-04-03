/**
 * AI chat/coach routes
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { getChatStream, extractVisualization } from '../lib/chatbot.js';
import type { ChatRequest } from '@algoarena/shared';

const router = Router();

/**
 * POST /api/chat
 * Streams AI coach response via SSE.
 * Events: {type:'text',chunk:string} | {type:'replace',text:string} | {type:'visualization',data:VisualizationData} | {type:'done'}
 */
router.post('/', async (req: Request, res: Response) => {
  const body = req.body as ChatRequest;
  const { message, problemContext, history } = body;

  if (!message || !problemContext) {
    res.status(400).json({ error: "Missing required fields: message, problemContext" });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (payload: object) => res.write(`data: ${JSON.stringify(payload)}\n\n`);

  try {
    let fullText = '';

    for await (const chunk of getChatStream(message, problemContext, history)) {
      fullText += chunk;
      sendEvent({ type: 'text', chunk });
    }

    const { cleanText, visualization } = await extractVisualization(fullText);

    if (fullText !== cleanText) {
      sendEvent({ type: 'replace', text: cleanText });
    }

    if (visualization) {
      sendEvent({ type: 'visualization', data: visualization });
    }

    sendEvent({ type: 'done' });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    sendEvent({ type: 'error', message: msg });
  } finally {
    res.end();
  }
});

export default router;
