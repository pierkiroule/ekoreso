import { Router } from 'express';
import { requireAdminKey } from './middleware.js';
import { recordResonance, getResonanceState, resetResonance } from '../services/resonanceEngine.js';

const router = Router();

router.get('/dashboard', requireAdminKey, (_req, res) => {
  const state = getResonanceState();
  const echoDensity = state.nodes.reduce((acc, node) => acc + node.weight, 0);

  return res.json({
    service: 'Reso•° admin console',
    status: 'online',
    lastUpdated: state.updatedAt,
    signals: state.nodes.length,
    edges: state.edges.length,
    echoDensity: Number.parseFloat(echoDensity.toFixed(3)),
    endpoints: {
      inject: '/admin/content',
      reset: '/admin/reset',
    },
    context: state.context,
  });
});

router.post('/content', requireAdminKey, (req, res) => {
  const { tags = [], media_url: mediaUrl } = req.body || {};
  if (!Array.isArray(tags) || tags.length === 0) {
    return res.status(400).json({ error: 'Les tags sont requis pour injecter un contenu.' });
  }

  const normalizedTags = tags.map((tag) => String(tag).toLowerCase()).slice(0, 12);
  const state = recordResonance(normalizedTags, { mediaUrl, from: 'admin' });

  return res.json({ status: 'content-registered', tags: normalizedTags, mediaUrl, state });
});

router.post('/reset', requireAdminKey, (req, res) => {
  const { reason } = req.body || {};
  const state = resetResonance({ reason: reason || 'reset manuel' });

  return res.json({ status: 'graph-reset', reason: state.context.reason, state });
});

export default router;
