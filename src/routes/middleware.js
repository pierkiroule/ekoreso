import { RESO_ADMIN_KEY, RESO_PUBLIC_KEY } from '../config.js';

const respondUnauthorized = (res) =>
  res.status(401).json({ error: 'Unauthorized: invalid or missing API key' });

export const requirePublicKey = (req, res, next) => {
  if (!RESO_PUBLIC_KEY) {
    return res.status(500).json({ error: 'Server misconfigured: RESO_PUBLIC_KEY missing' });
  }
  const providedKey = req.header('X-API-KEY');
  if (providedKey !== RESO_PUBLIC_KEY) {
    return respondUnauthorized(res);
  }
  return next();
};

export const requireAdminKey = (req, res, next) => {
  if (!RESO_ADMIN_KEY) {
    return res.status(500).json({ error: 'Server misconfigured: RESO_ADMIN_KEY missing' });
  }
  const providedKey = req.header('X-API-KEY');
  if (providedKey !== RESO_ADMIN_KEY) {
    return respondUnauthorized(res);
  }
  return next();
};
