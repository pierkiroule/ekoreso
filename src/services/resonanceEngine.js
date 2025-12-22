import { applyDecay } from './decay.js';

const resonanceGraph = new Map();
let lastUpdated = Date.now();

const resetGraph = () => {
  resonanceGraph.clear();
  lastUpdated = Date.now();
};

const ensureNode = (tag) => {
  if (!resonanceGraph.has(tag)) {
    resonanceGraph.set(tag, { weight: 0, links: new Map() });
  }
  return resonanceGraph.get(tag);
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

  return getResonanceState({ lastPayload: payload, lastEchoAt: timestamp });
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
    context,
  };
};

export const resetResonance = (context = {}) => {
  resetGraph();
  return getResonanceState({ ...context, resetAt: new Date(lastUpdated).toISOString() });
};
