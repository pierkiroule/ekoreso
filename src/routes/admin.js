import { Router } from 'express';
import { requireAdminKey } from './middleware.js';
import { recordResonance } from '../services/resonanceEngine.js';

const router = Router();

router.post('/content', requireAdminKey, (req, res) => {
  const { tags = [], media_url: mediaUrl } = req.body || {};
  if (!Array.isArray(tags) || tags.length === 0) {
    return res.status(400).json({ error: 'Les tags sont requis pour injecter un contenu.' });
  }

  const normalizedTags = tags.map((tag) => String(tag).toLowerCase()).slice(0, 12);
  const state = recordResonance(normalizedTags, { mediaUrl, from: 'admin' });

  return res.json({ status: 'content-registered', tags: normalizedTags, mediaUrl, state });
});

export default router;
