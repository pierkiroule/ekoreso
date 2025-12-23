import { Router } from 'express';
import { requirePublicKey } from './middleware.js';
import { generateEchobulle } from '../services/echobulleGenerator.js';
import { recordResonance, getResonanceState } from '../services/resonanceEngine.js';

const router = Router();

router.post('/echo', requirePublicKey, (req, res) => {
  const { tags = [], payload = {}, media } = req.body || {};
  if (!Array.isArray(tags) || tags.length === 0) {
    return res
      .status(400)
      .json({ error: 'Le corps de la requête doit contenir un tableau tags non vide' });
  }

  const normalizedTags = tags.map((tag) => String(tag).toLowerCase()).slice(0, 12);
  const mergedPayload = media ? { ...payload, media } : payload;
  const state = recordResonance(normalizedTags, mergedPayload);

  return res.json({ status: 'echo-accepted', tags: normalizedTags, state });
});

router.get('/echobulle', (_req, res) => {
  const state = getResonanceState();
  const echobulle = generateEchobulle(state);
  return res.json(echobulle);
});

export default router;
