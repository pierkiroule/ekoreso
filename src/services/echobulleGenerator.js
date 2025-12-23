const normalize = (value) => Number.parseFloat(value).toFixed(3);

export const generateEchobulle = (state) => {
  const nodes = [...(state?.nodes || [])].sort((a, b) => b.weight - a.weight);
  const focus = nodes.slice(0, 3).map((node) => node.tag);
  const echoDensity = nodes.reduce((acc, node) => acc + node.weight, 0);
  const transmedia = (state?.context?.transmedia || []).slice(0, 3);

  const signals = nodes.slice(0, 10).map((node) => ({
    tag: node.tag,
    energy: Number(normalize(node.weight)),
  }));

  const edges = (state?.edges || [])
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 10)
    .map((edge) => ({
      ...edge,
      weight: Number(normalize(edge.weight)),
    }));

  return {
    generatedAt: new Date().toISOString(),
    focus,
    echoDensity: Number(normalize(echoDensity)),
    signals,
    edges,
    transmedia,
    context: state?.context ?? {},
  };
};
