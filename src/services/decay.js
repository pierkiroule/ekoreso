const HALF_LIFE_MS = 1000 * 60 * 60; // 1h par défaut

export const applyDecay = (value, elapsedMs, halfLifeMs = HALF_LIFE_MS) => {
  if (value <= 0 || elapsedMs <= 0) return value;
  const decayFactor = Math.pow(0.5, elapsedMs / halfLifeMs);
  return Number(value * decayFactor);
};
