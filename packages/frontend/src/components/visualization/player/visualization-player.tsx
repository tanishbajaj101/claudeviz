import { useCallback, useState, useMemo } from 'react';
import { usePlayer } from '../hooks/usePlayer';
import PlayerControls from './PlayerControls';
import RecursionStack from './RecursionStack';
import StepLogger from './StepLogger';
import {
  LinearRenderer,
  GridRenderer,
  TreeRenderer,
  GraphRenderer,
  LinkedListRenderer,
  DSURenderer,
  RecursiveLinearRenderer
} from '../renderers';
import '../visualization.css';

interface VisualizationPlayerProps {
  config: any;
  steps: any[];
  initialStep?: number;
}

function RendererFor({ config, steps, currentIndex, isSeek }: { config: any, steps: any[], currentIndex: number, isSeek: boolean }) {
  const props = { config, steps, currentIndex, isSeek };
  switch (config?.type) {
    case 'linear':      return <LinearRenderer {...props} />;
    case 'recursive-linear': return <RecursiveLinearRenderer {...props} />;
    case 'grid':        return <GridRenderer {...props} />;
    case 'tree':        return <TreeRenderer {...props} />;
    case 'graph':       return <GraphRenderer {...props} />;
    case 'linked-list': return <LinkedListRenderer {...props} />;
    case 'dsu':         return <DSURenderer {...props} />;
    default:            return null;
  }
}

// Precompute per-renderer filtered steps + globalIndex→localIndex maps
function buildRendererData(renderers: any[], steps: any[]) {
  const result: Record<string, { filtered: any[], globalToLocal: number[] }> = {};
  renderers.forEach(r => {
    const filtered = steps.filter(s => !s._renderer || s._renderer === r.id);
    // For each global step index, what is the local index within filtered?
    const globalToLocal = new Array(steps.length).fill(-1);
    let local = -1;
    steps.forEach((s, gi) => {
      if (!s._renderer || s._renderer === r.id) local++;
      globalToLocal[gi] = local;
    });
    result[r.id] = { filtered, globalToLocal };
  });
  return result;
}

export function VisualizationPlayer({ config, steps, initialStep }: VisualizationPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSeek, setIsSeek] = useState(false);
  const [recursionFrames, setRecursionFrames] = useState<any[]>([]);
  const [returnFlash, setReturnFlash] = useState<any>(null);

  const isMulti = config?.type === 'multi';

  const rendererData = useMemo(() => {
    if (!isMulti || !steps || !config.renderers) return null;
    return buildRendererData(config.renderers, steps);
  }, [isMulti, config, steps]);

  const handleStep = useCallback((step: any, index: number, seek = false) => {
    setIsSeek(seek);
    if (!step || index < 0) {
      setCurrentIndex(-1);
      setRecursionFrames([]);
      setReturnFlash(null);
      return;
    }
    setCurrentIndex(index);
    if (seek) {
      const frames = [];
      for (let i = 0; i <= index; i++) {
        const s = steps[i];
        if (s.type === 'recursion-push') frames.push(s.frame);
        else if (s.type === 'recursion-pop') frames.pop();
      }
      setRecursionFrames(frames);
    } else {
      if (step.type === 'recursion-push') {
        setRecursionFrames(f => [...f, step.frame]);
      } else if (step.type === 'recursion-pop') {
        setReturnFlash(step.returnValue);
        setRecursionFrames(f => f.slice(0, -1));
        setTimeout(() => setReturnFlash(null), 600);
      }
    }
  }, [steps]);

  const player = usePlayer(steps, handleStep, initialStep);
  const hasRecursion = useMemo(() => steps?.some(s => s.type === 'recursion-push'), [steps]);

  const renderPanel = (cfg: any, filteredSteps: any[], localIndex: number, label?: string) => (
    <div
      key={cfg.id || cfg.type}
      style={{
        flex: cfg.weight ?? 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        minWidth: 0,
        minHeight: 0,
      }}
    >
      {label && (
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'hsl(var(--muted-foreground))',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          paddingLeft: 4,
        }}>
          {label}
        </div>
      )}
      <div className="viz-scrollable" style={{
        flex: 1,
        background: 'hsl(var(--card))',
        borderRadius: 8,
        border: '1px solid hsl(var(--border))',
        overflow: 'auto',
        padding: 24,
      }}>
        <RendererFor
          config={cfg}
          steps={filteredSteps}
          currentIndex={localIndex}
          isSeek={isSeek}
        />
      </div>
    </div>
  );

  let visualization;
  if (isMulti && rendererData) {
    const direction = config.layout === 'vertical' ? 'column' : 'row';
    visualization = (
      <div style={{ display: 'flex', flexDirection: direction as any, flex: 1, gap: 8, minHeight: 0 }}>
        {config.renderers.map((r: any) => {
          const rd = rendererData[r.id];
          const localIndex = currentIndex >= 0 ? rd.globalToLocal[currentIndex] : -1;
          return renderPanel(r, rd.filtered, localIndex, r.label);
        })}
      </div>
    );
  } else {
    visualization = (
      <div className="viz-scrollable" style={{
        flex: 1,
        background: 'hsl(var(--card))',
        borderRadius: 8,
        border: '1px solid hsl(var(--border))',
        overflow: 'auto',
        padding: 24,
        minHeight: 0,
      }}>
        <RendererFor
          config={config}
          steps={steps}
          currentIndex={currentIndex}
          isSeek={isSeek}
        />
      </div>
    );
  }

  return (
    <div className="visualization-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8, padding: '8px' }}>
      <div style={{ display: 'flex', flex: 1, gap: 8, minHeight: 0 }}>
        {visualization}
        {hasRecursion && (
          <RecursionStack frames={recursionFrames} returnFlash={returnFlash} />
        )}
      </div>
      <StepLogger steps={steps} currentIndex={currentIndex} />
      <PlayerControls player={player} totalSteps={steps?.length || 0} />
    </div>
  );
}
