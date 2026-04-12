import { useCallback, useState, useMemo, useRef, useEffect } from 'react';
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
    // Batch steps are global; pre-filter their sub-steps to only those for this renderer
    const filtered = steps
      .map(s => s.type === 'batch'
        ? { ...s, steps: s.steps.filter((sub: any) => !sub._renderer || sub._renderer === r.id) }
        : s
      )
      .filter(s => s.type === 'batch' || !s._renderer || s._renderer === r.id);

    // For each global step index, what is the local index within filtered?
    const globalToLocal = new Array(steps.length).fill(-1);
    let local = -1;
    steps.forEach((s, gi) => {
      if (s.type === 'batch' || !s._renderer || s._renderer === r.id) local++;
      globalToLocal[gi] = local;
    });
    result[r.id] = { filtered, globalToLocal };
  });
  return result;
}

// Initialise panel sizes as percentages from renderer weights
function initSizes(renderers: any[]): number[] {
  const weights = renderers.map((r: any) => r.weight ?? 1);
  const total = weights.reduce((a: number, b: number) => a + b, 0);
  return weights.map((w: number) => (w / total) * 100);
}

export function VisualizationPlayer({ config, steps, initialStep }: VisualizationPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSeek, setIsSeek] = useState(false);
  const [recursionFrames, setRecursionFrames] = useState<any[]>([]);
  const [returnFlash, setReturnFlash] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const multiContainerRef = useRef<HTMLDivElement>(null);

  // Panel sizes (%) for multi-renderer layout — reset when renderers change
  const isMulti = config?.type === 'multi';
  const rendererCount = isMulti ? config.renderers?.length ?? 0 : 0;
  const [panelSizes, setPanelSizes] = useState<number[]>(() =>
    isMulti && config.renderers ? initSizes(config.renderers) : []
  );
  useEffect(() => {
    if (isMulti && config.renderers) setPanelSizes(initSizes(config.renderers));
  }, [isMulti, rendererCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // Drag state (not in React state to avoid re-renders during drag)
  const dragRef = useRef<{
    index: number;        // divider index (between panel i and i+1)
    startPos: number;     // clientX or clientY at drag start
    startSizes: number[]; // snapshot of panelSizes at drag start
    isVertical: boolean;
    containerSize: number;
  } | null>(null);

  const startDrag = useCallback((e: React.MouseEvent, dividerIndex: number) => {
    e.preventDefault();
    const el = multiContainerRef.current;
    if (!el) return;
    const isVertical = config.layout === 'vertical';
    const containerSize = isVertical ? el.offsetHeight : el.offsetWidth;
    dragRef.current = {
      index: dividerIndex,
      startPos: isVertical ? e.clientY : e.clientX,
      startSizes: [...panelSizes],
      isVertical,
      containerSize,
    };

    const onMove = (me: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const pos = d.isVertical ? me.clientY : me.clientX;
      const deltaPct = ((pos - d.startPos) / d.containerSize) * 100;
      setPanelSizes(prev => {
        const next = [...prev];
        const MIN = 10;
        let a = d.startSizes[d.index] + deltaPct;
        let b = d.startSizes[d.index + 1] - deltaPct;
        if (a < MIN) { b -= (MIN - a); a = MIN; }
        if (b < MIN) { a -= (MIN - b); b = MIN; }
        next[d.index] = a;
        next[d.index + 1] = b;
        return next;
      });
    };

    const onUp = () => {
      dragRef.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [config, panelSizes]);

  useEffect(() => {
    const onchange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onchange);
    return () => document.removeEventListener('fullscreenchange', onchange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

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

  const currentTime = useMemo(() => {
    if (!steps || currentIndex < 0) return null;
    for (let i = currentIndex; i >= 0; i--) {
      if (steps[i].type === 'time') return steps[i].value;
    }
    return null;
  }, [steps, currentIndex]);

  const renderPanel = (cfg: any, filteredSteps: any[], localIndex: number, sizePct: number, label?: string) => (
    <div
      key={cfg.id || cfg.type}
      style={{
        flex: `0 0 ${sizePct}%`,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
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
    const isVertical = config.layout === 'vertical';
    const direction = isVertical ? 'column' : 'row';
    const dividerStyle: React.CSSProperties = isVertical
      ? { height: 6, cursor: 'row-resize', flexShrink: 0 }
      : { width: 6, cursor: 'col-resize', flexShrink: 0 };

    const panels: React.ReactNode[] = [];
    config.renderers.forEach((r: any, i: number) => {
      const rd = rendererData[r.id];
      const localIndex = currentIndex >= 0 ? rd.globalToLocal[currentIndex] : -1;
      const sizePct = panelSizes[i] ?? (100 / config.renderers.length);
      panels.push(renderPanel(r, rd.filtered, localIndex, sizePct, r.label));
      if (i < config.renderers.length - 1) {
        panels.push(
          <div
            key={`divider-${i}`}
            className="viz-divider"
            style={dividerStyle}
            onMouseDown={(e) => startDrag(e, i)}
          />
        );
      }
    });

    visualization = (
      <div
        ref={multiContainerRef}
        style={{ display: 'flex', flexDirection: direction as any, flex: 1, gap: 0, minHeight: 0 }}
      >
        {panels}
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
    <div
      ref={containerRef}
      className="visualization-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: 8,
        padding: '8px',
        position: 'relative',
        background: isFullscreen ? 'hsl(var(--background))' : undefined,
      }}
    >
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: 6,
          border: '1px solid hsl(var(--border))',
          background: 'hsl(var(--card))',
          color: 'hsl(var(--muted-foreground))',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {isFullscreen ? (
          // Compress icon
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3"/>
            <path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
            <path d="M3 16h3a2 2 0 0 1 2 2v3"/>
            <path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
          </svg>
        ) : (
          // Expand icon
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
            <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
            <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
            <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
          </svg>
        )}
      </button>
      <div style={{ display: 'flex', flex: 1, gap: 8, minHeight: 0 }}>
        {visualization}
        {hasRecursion && (
          <RecursionStack frames={recursionFrames} returnFlash={returnFlash} />
        )}
      </div>
      <StepLogger steps={steps} currentIndex={currentIndex} />
      <PlayerControls player={player} totalSteps={steps?.length || 0} currentTime={currentTime} />
    </div>
  );
}
