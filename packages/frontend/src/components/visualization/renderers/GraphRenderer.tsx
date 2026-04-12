import { useEffect, useState, useRef } from 'react';
import AnimatedElement from '../ui/AnimatedElement';
import AnimatedEdge from '../ui/AnimatedEdge';
import PointerLabel from '../ui/PointerLabel';
import { STATE_COLORS, EDGE_COLORS, COMPARE_COLORS, POINTER_PALETTE, HIGHLIGHT_RANGE_COLOR, DURATIONS } from '../constants';
import { RendererProps } from './types';

const NODE_SIZE = 44;
const PAD = 80;

interface GraphNode {
  id: string;
  value: any;
  color: string;
  textColor: string;
  opacity: number;
  _fadingIn?: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
  weight: number | null;
  color: string;
  opacity: number;
}

interface GraphState {
  nodes: Record<string, GraphNode>;
  edges: GraphEdge[];
  nodeLayout: Record<string, { x: number; y: number }>;
  pointers: Record<string, string>;
  levelHighlights: string[];
  annotations: Record<string, string>;
  elementGroups: Record<string, string>;
  rangeHighlights: string[];
  _pendingRemove?: string;
}

// Simple circular layout fallback since we don't have d3-force installed
function computeSimpleLayout(nodes: any[], edges: any[], existingLayout: any = {}) {
  const layout: Record<string, { x: number, y: number }> = {};
  const n = nodes.length;
  const radius = Math.max(150, n * 20);
  
  nodes.forEach((node, i) => {
    if (existingLayout[node.id]) {
      layout[node.id] = existingLayout[node.id];
      return;
    }
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    layout[node.id] = {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    };
  });
  return layout;
}

function initState(config: any): GraphState {
  if (!config || !config.nodes) return { nodes: {}, edges: [], nodeLayout: {}, pointers: {}, levelHighlights: [], annotations: {}, elementGroups: {}, rangeHighlights: [] };
  const nodes: Record<string, GraphNode> = {};
  config.nodes.forEach((n: any) => { nodes[n.id] = { id: n.id, value: n.value ?? n.id, color: STATE_COLORS.default.bg, textColor: STATE_COLORS.default.text, opacity: 1 }; });
  const edges: GraphEdge[] = (config.edges || []).map((e: any) => ({ from: e.from, to: e.to, weight: e.weight ?? null, color: EDGE_COLORS.default, opacity: 1 }));
  const layout = computeSimpleLayout(config.nodes, edges);
  return { nodes, edges, nodeLayout: layout, pointers: {}, levelHighlights: [], annotations: {}, elementGroups: {}, rangeHighlights: [] };
}

function applyStepToState(state: GraphState, step: any, instant: boolean, config: any, isTopLevel = true): GraphState {
  if (!step) return state;
  if (isTopLevel) state = { ...state, annotations: {} };
  let { nodes, edges, pointers, annotations, elementGroups, nodeLayout } = state;

  switch (step.type) {
    case 'visit': {
      const sc = (STATE_COLORS as any)[step.state] || STATE_COLORS.default;
      const nn = { ...nodes };
      if (nn[step.target]) nn[step.target] = { ...nn[step.target], color: sc.bg, textColor: sc.text };
      return { ...state, nodes: nn };
    }
    case 'compare': {
      let fc = COMPARE_COLORS.neutral;
      if (step.result === 'pass') fc = COMPARE_COLORS.pass;
      else if (step.result === 'fail') fc = COMPARE_COLORS.fail;
      const nn = { ...nodes };
      step.targets.forEach((id: string) => { if (nn[id]) nn[id] = { ...nn[id], color: fc, textColor: '#374151' }; });
      return { ...state, nodes: nn };
    }
    case 'value-update': {
      const nn = { ...nodes };
      if (nn[step.target]) nn[step.target] = { ...nn[step.target], value: step.value };
      return { ...state, nodes: nn };
    }
    case 'fade-in': {
      const nn = { ...nodes };
      nn[step.target] = { id: step.target, value: step.value ?? step.target, color: STATE_COLORS.default.bg, textColor: STATE_COLORS.default.text, opacity: instant ? 1 : 0, _fadingIn: !instant };
      const allNodes = Object.values(nn).map((n) => ({ id: n.id }));
      const nl = computeSimpleLayout(allNodes, edges, nodeLayout);
      return { ...state, nodes: nn, nodeLayout: nl };
    }
    case 'fade-out': {
      const nn = { ...nodes };
      if (nn[step.target]) nn[step.target] = { ...nn[step.target], opacity: 0 };
      return { ...state, nodes: nn, _pendingRemove: step.target };
    }
    case 'edge-update': {
      const [from, to] = step.edge; const ec = (EDGE_COLORS as any)[step.state] || EDGE_COLORS.default;
      if (from === to) { const nn = { ...nodes }; if (nn[from]) nn[from] = { ...nn[from], color: STATE_COLORS.visited.bg, textColor: STATE_COLORS.visited.text }; return { ...state, nodes: nn }; }
      const ne = edges.map((e) => (e.from === from && e.to === to) || (!config?.directed && e.from === to && e.to === from) ? { ...e, color: ec } : e);
      return { ...state, edges: ne };
    }
    case 'weight-update': {
      const [from, to] = step.edge;
      const ne = edges.map((e) => e.from === from && e.to === to ? { ...e, weight: step.weight } : e);
      return { ...state, edges: ne };
    }
    case 'level-highlight': return { ...state, levelHighlights: step.targets || [] };
    case 'highlight-range': return { ...state, rangeHighlights: step.targets || [] };
    case 'annotate': {
      const na = { ...annotations };
      if (step.text === null) delete na[step.target]; else na[step.target] = step.text;
      return { ...state, annotations: na };
    }
    case 'group': {
      if (!step.targets) return { ...state, elementGroups: {} };
      const ng = { ...elementGroups };
      step.targets.forEach((id: string) => { if (step.color === null) delete ng[id]; else ng[id] = step.color; });
      return { ...state, elementGroups: ng };
    }
    case 'pointer': {
      const { label, to } = step;
      if (to === null || to === undefined) { const np = { ...pointers }; delete np[label]; return { ...state, pointers: np }; }
      return { ...state, pointers: { ...pointers, [label]: to } };
    }
    case 'batch': {
      return (step.steps as any[]).reduce(
        (s: GraphState, sub: any) => applyStepToState(s, sub, instant, config, false),
        state
      );
    }
    default: return state;
  }
}

function finalizePendingRemove(state: GraphState): GraphState {
  if (state._pendingRemove === undefined) return state;
  const target = state._pendingRemove;
  const newNodes = { ...state.nodes }; delete newNodes[target];
  const newEdges = state.edges.filter((e) => e.from !== target && e.to !== target);
  const allNodes = Object.values(newNodes).map((n) => ({ id: n.id }));
  const nl = computeSimpleLayout(allNodes, newEdges, state.nodeLayout);
  return { ...state, nodes: newNodes, edges: newEdges, nodeLayout: nl, _pendingRemove: undefined };
}

function finalizeFadeIn(state: GraphState): GraphState {
  const newNodes: Record<string, GraphNode> = {}; let changed = false;
  Object.entries(state.nodes).forEach(([id, n]) => {
    if (n._fadingIn) { newNodes[id] = { ...n, opacity: 1, _fadingIn: false }; changed = true; }
    else newNodes[id] = n;
  });
  return changed ? { ...state, nodes: newNodes } : state;
}

export default function GraphRenderer({ config, steps, currentIndex, isSeek }: RendererProps) {
  const [state, setState] = useState(() => initState(config));

  useEffect(() => {
    const initialState = initState(config);
    setState(initialState);
  }, [config]);

  useEffect(() => {
    if (currentIndex < 0 || !steps) {
      setState(initState(config));
      return;
    }

    if (isSeek) {
      let s = initState(config);
      for (let i = 0; i <= currentIndex; i++) {
        s = applyStepToState(s, steps[i], true, config);
        if (s._pendingRemove !== undefined) s = finalizePendingRemove(s);
        s = finalizeFadeIn(s);
      }
      setState(s);
    } else {
      setState(prev => {
        let s = finalizePendingRemove(prev);
        const newState = applyStepToState(s, steps[currentIndex], false, config);
        return newState;
      });

      if (steps[currentIndex]?.type === 'fade-in') {
        setTimeout(() => setState(prev => finalizeFadeIn(prev)), 50);
      }
      if (steps[currentIndex]?.type === 'fade-out') {
        setTimeout(() => setState(prev => finalizePendingRemove(prev)), DURATIONS.fade + 100);
      }
    }
  }, [currentIndex, isSeek, config, steps]);

  const { nodes, edges, nodeLayout, pointers, levelHighlights, annotations, elementGroups, rangeHighlights } = state;
  const nodeList = Object.values(nodes);
  if (nodeList.length === 0) return <div style={{ color: '#9CA3AF', fontFamily: 'monospace', fontSize: 13 }}>No graph data</div>;

  const xs = nodeList.map((n: any) => nodeLayout[n.id]?.x ?? 0);
  const ys = nodeList.map((n: any) => nodeLayout[n.id]?.y ?? 0);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const w = maxX - minX + NODE_SIZE + PAD * 2;
  const h = maxY - minY + NODE_SIZE + PAD * 2;
  const offsetX = PAD - minX; const offsetY = PAD - minY;

  const pointerEntries = Object.entries(pointers);
  const pointerColorMap: Record<string, string> = {};
  pointerEntries.forEach(([label], i) => { pointerColorMap[label] = POINTER_PALETTE[i % POINTER_PALETTE.length]; });

  const hlSet = new Set(levelHighlights);
  const rnSet = new Set(rangeHighlights);

  return (
    <div style={{ position: 'relative', width: w, height: h, transition: `width ${DURATIONS.layout}ms ease, height ${DURATIONS.layout}ms ease` }}>
      {nodeList.filter((n) => hlSet.has(n.id)).map((node) => {
        const pos = nodeLayout[node.id]; if (!pos) return null;
        return <div key={`hl-${node.id}`} style={{ position: 'absolute',
          left: pos.x + offsetX - 6, top: pos.y + offsetY - 6,
          width: NODE_SIZE + 12, height: NODE_SIZE + 12, borderRadius: '50%',
          background: 'rgba(254,243,199,0.6)', border: '2px dashed #F59E0B',
          pointerEvents: 'none', zIndex: 0, transition: isSeek ? 'none' : `all ${DURATIONS.layout}ms ease-out` }} />;
      })}
      {nodeList.filter((n) => rnSet.has(n.id)).map((node) => {
        const pos = nodeLayout[node.id]; if (!pos) return null;
        return <div key={`rh-${node.id}`} style={{ position: 'absolute',
          left: pos.x + offsetX - 6, top: pos.y + offsetY - 6,
          width: NODE_SIZE + 12, height: NODE_SIZE + 12, borderRadius: '50%',
          background: HIGHLIGHT_RANGE_COLOR.bg,
          border: `2px solid ${HIGHLIGHT_RANGE_COLOR.border}`,
          pointerEvents: 'none', zIndex: 0, transition: isSeek ? 'none' : `all ${DURATIONS.layout}ms ease-out` }} />;
      })}
      <svg style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }} width={w} height={h}>
        {edges.map((edge, i) => {
          const fp = nodeLayout[edge.from]; const tp = nodeLayout[edge.to];
          if (!fp || !tp) return null;
          return <AnimatedEdge key={`${edge.from}-${edge.to}-${i}`}
            x1={fp.x + offsetX + NODE_SIZE / 2} y1={fp.y + offsetY + NODE_SIZE / 2}
            x2={tp.x + offsetX + NODE_SIZE / 2} y2={tp.y + offsetY + NODE_SIZE / 2}
            color={edge.color} opacity={edge.opacity} directed={config?.directed ?? false}
            weight={edge.weight} instant={isSeek} />;
        })}
      </svg>
      {nodeList.map((node) => {
        const pos = nodeLayout[node.id]; if (!pos) return null;
        return <AnimatedElement key={node.id}
          x={pos.x + offsetX} y={pos.y + offsetY}
          value={node.value} color={node.color} textColor={node.textColor}
          opacity={node.opacity} size={NODE_SIZE} instant={isSeek}
          groupColor={elementGroups[node.id] ?? null}
        />;
      })}
      {pointerEntries.map(([label, targetId]) => {
        const pos = nodeLayout[targetId as string]; if (!pos) return null;
        return <PointerLabel key={label} label={label}
          x={pos.x + offsetX + NODE_SIZE / 2} y={pos.y + offsetY}
          color={pointerColorMap[label]} position='above' instant={isSeek} />;
      })}
      {Object.entries(annotations).map(([nodeId, text]) => {
        const pos = nodeLayout[nodeId]; if (!pos) return null;
        return <PointerLabel key={`ann-${nodeId}`} label={text}
          x={pos.x + offsetX + NODE_SIZE / 2} y={pos.y + offsetY + NODE_SIZE}
          color='#374151' position='below' instant={isSeek} />;
      })}
    </div>
  );
}
