import { applyDecay } from './decay.js';

const resonanceGraph = new Map();
const recentTransmedia = [];
let lastUpdated = Date.now();

const MAX_RECENT_MEDIA = 6;

const resetGraph = () => {
  resonanceGraph.clear();
  recentTransmedia.length = 0;
  lastUpdated = Date.now();
};

const ensureNode = (tag) => {
  if (!resonanceGraph.has(tag)) {
    resonanceGraph.set(tag, { weight: 0, links: new Map() });
  }
  return resonanceGraph.get(tag);
};

const normalizeTransmedia = (payload = {}, tags = []) => {
  const media = payload.media || {};
  const skyboxUrl = payload.skyboxUrl || media.skyboxUrl || payload.media_url || media.mediaUrl;
  const audioUrl = payload.audioUrl || media.audioUrl;

  if (!skyboxUrl && !audioUrl) return null;

  return {
    tags,
    skyboxUrl: skyboxUrl || null,
    audioUrl: audioUrl || null,
    prompt: media.prompt || payload.prompt || null,
    narrative: media.narrative || payload.narrative || payload.description || null,
    capturedAt: new Date().toISOString(),
  };
};

const registerTransmedia = (payload, tags) => {
  const mediaEntry = normalizeTransmedia(payload, tags);
  if (!mediaEntry) return null;

  recentTransmedia.unshift(mediaEntry);
  if (recentTransmedia.length > MAX_RECENT_MEDIA) {
    recentTransmedia.length = MAX_RECENT_MEDIA;
  }
  return mediaEntry;
};

const decayGraph = () => {
  const now = Date.now();
  const elapsed = now - lastUpdated;
  if (elapsed <= 0) return;

  for (const [, entry] of resonanceGraph) {
    entry.weight = applyDecay(entry.weight, elapsed);
    for (const [target, weight] of entry.links) {
      entry.links.set(target, applyDecay(weight, elapsed));
    }
  }
  lastUpdated = now;
};

export const recordResonance = (tags = [], payload = {}) => {
  decayGraph();
  const timestamp = new Date().toISOString();

  tags.forEach((tag) => {
    const node = ensureNode(tag);
    node.weight += 1;
  });

  for (let i = 0; i < tags.length; i += 1) {
    for (let j = i + 1; j < tags.length; j += 1) {
      const a = ensureNode(tags[i]);
      const b = ensureNode(tags[j]);
      a.links.set(tags[j], (a.links.get(tags[j]) || 0) + 1);
      b.links.set(tags[i], (b.links.get(tags[i]) || 0) + 1);
    }
  }

  const mediaEntry = registerTransmedia(payload, tags);

  return getResonanceState({
    lastPayload: payload,
    lastEchoAt: timestamp,
    lastTransmedia: mediaEntry,
  });
};

export const getResonanceState = (context = {}) => {
  decayGraph();
  const nodes = [];
  const edges = [];
  const seenPairs = new Set();

  for (const [tag, entry] of resonanceGraph) {
    nodes.push({ tag, weight: Number(entry.weight.toFixed(4)) });
    for (const [target, weight] of entry.links) {
      const edgeId = [tag, target].sort().join('>');
      if (seenPairs.has(edgeId)) continue;
      seenPairs.add(edgeId);
      edges.push({
        source: tag,
        target,
        weight: Number(weight.toFixed(4)),
      });
    }
  }

  return {
    updatedAt: new Date(lastUpdated).toISOString(),
    nodes,
    edges,
    context: { ...context, transmedia: [...recentTransmedia] },
  };
};

export const resetResonance = (context = {}) => {
  resetGraph();
  return getResonanceState({ ...context, resetAt: new Date(lastUpdated).toISOString() });
};
