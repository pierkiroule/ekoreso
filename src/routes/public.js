import { Router } from 'express';
import { generateEchobulle } from '../services/echobulleGenerator.js';
import { getResonanceState } from '../services/resonanceEngine.js';

const router = Router();

router.get('/hublot', (_req, res) => {
  const state = getResonanceState();
  const echobulle = generateEchobulle(state);

  const mockFlux = {
    generatedAt: new Date().toISOString(),
    synopsis: 'Flux agrégé simulé pour illustrer Reso•°',
    echobulle,
    signalCount: state.nodes.length,
  };

  return res.json(mockFlux);
});

export default router;
