import { useState, useEffect, useCallback } from 'react';
import { VisualizationPlayer, executeVisualizationCode } from '../visualization';

/**
 * Disjoint Set Union (Union-Find) visualization code.
 * Demonstrates union by rank with path compression.
 * This is injected JS — the same format the AI agent generates.
 */
const DSU_CODE = `
var n = INPUTS.n;
var unions = INPUTS.unions;

var nodes = [];
var parents = {};
var rnk = {};
for (var i = 0; i < n; i++) {
  nodes.push({ id: String(i), value: i });
  parents[String(i)] = String(i);
  rnk[String(i)] = 0;
}

tracer.init({
  type: 'dsu',
  nodes: nodes,
  parents: parents,
});

function find(x) {
  tracer.visit(String(x), 'exploring');
  if (parents[String(x)] !== String(x)) {
    var root = find(Number(parents[String(x)]));
    if (parents[String(x)] !== String(root)) {
      tracer.reparent(String(x), String(root));
      parents[String(x)] = String(root);
    }
    return root;
  }
  tracer.visit(String(x), 'active');
  return x;
}

function unite(a, b) {
  tracer.pointer('u', String(a));
  tracer.pointer('v', String(b));
  tracer.compare([String(a), String(b)]);

  var rootA = find(a);
  var rootB = find(b);

  if (rootA === rootB) {
    tracer.compare([String(rootA), String(rootB)], 'fail');
    for (var k = 0; k < n; k++) tracer.visit(String(k), 'default');
    return;
  }

  tracer.compare([String(rootA), String(rootB)], 'pass');

  if (rnk[String(rootA)] < rnk[String(rootB)]) {
    tracer.reparent(String(rootA), String(rootB));
    parents[String(rootA)] = String(rootB);
  } else if (rnk[String(rootA)] > rnk[String(rootB)]) {
    tracer.reparent(String(rootB), String(rootA));
    parents[String(rootB)] = String(rootA);
  } else {
    tracer.reparent(String(rootB), String(rootA));
    parents[String(rootB)] = String(rootA);
    rnk[String(rootA)]++;
  }

  for (var k = 0; k < n; k++) tracer.visit(String(k), 'default');
}

for (var u = 0; u < unions.length; u++) {
  unite(unions[u][0], unions[u][1]);
}

// Mark final roots
for (var i = 0; i < n; i++) find(i);
for (var i = 0; i < n; i++) {
  if (parents[String(i)] === String(i)) {
    tracer.visit(String(i), 'visited');
  }
}
`;

const DEFAULT_INPUTS = {
  n: 7,
  unions: [[0, 1], [2, 3], [5, 6], [3, 4], [1, 3], [0, 6]],
};

export function VisualizationShowcase() {
  const [steps, setSteps] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const initialStep = steps.length > 0 ? Math.min(72, steps.length - 1) : undefined;

  const runVisualization = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await executeVisualizationCode(DSU_CODE, DEFAULT_INPUTS);

    if (result.success && result.steps && result.config) {
      setSteps(result.steps);
      setConfig(result.config);
    } else {
      setError(result.error || 'Visualization failed');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    runVisualization();
  }, [runVisualization]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
        // algorithm visualizations
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Real visualization player */}
        <div className="rounded-lg border border-border bg-card overflow-hidden order-2 md:order-1">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="font-mono text-xs font-semibold text-foreground">Disjoint Set Union (Union-Find)</span>
            <span className="font-mono text-[10px] text-muted-foreground">Live Demo</span>
          </div>

          {/* Player area */}
          <div style={{ height: 420 }}>
            {loading && (
              <div className="flex items-center justify-center h-full">
                <p className="font-mono text-xs text-muted-foreground">Loading visualization...</p>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center h-full px-4">
                <p className="font-mono text-xs text-red-500">Error: {error}</p>
              </div>
            )}
            {!loading && !error && config && (
              <VisualizationPlayer config={config} steps={steps} initialStep={initialStep} />
            )}
          </div>
        </div>

        {/* Text */}
        <div className="order-1 md:order-2">
          {/* Doodle hint */}
          <div className="mb-4 -ml-6 -mt-4 flex items-center gap-2">
            <svg width="120" height="32" viewBox="0 0 120 32" fill="none" className="text-primary -rotate-2">
              {/* Squiggly arrow pointing left toward the player */}
              <path
                d="M115 8 C105 4, 95 14, 85 10 C75 6, 65 16, 55 12 C45 8, 35 18, 25 14 L28 8 M25 14 L30 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span
              className="text-primary text-sm select-none -mt-2"
              style={{
                fontFamily: "'Comic Sans MS', 'Comic Sans', 'Segoe Print', 'Bradley Hand', cursive",
                fontStyle: 'italic',
                transform: 'rotate(-1deg)',
                display: 'inline-block',
              }}
            >
              try clicking the play button!
            </span>
          </div>

          <h2 className="font-mono text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Watch algorithms come alive, step by step
          </h2>
          <div className="mt-6 space-y-3">
            <Bullet text="Arrays, trees, graphs, linked lists, DSU, and more" />
            <Bullet text="Play, pause, step through at your own pace" />
            <Bullet text="Real code execution — not a static mockup" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <p className="font-mono text-sm text-muted-foreground">
      <span className="text-primary mr-2">{'>'}</span>
      {text}
    </p>
  );
}
