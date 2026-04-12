import { useEffect, useState } from 'react';
import AnimatedElement from '../ui/AnimatedElement';
import AnimatedEdge from '../ui/AnimatedEdge';
import PointerLabel from '../ui/PointerLabel';
import { STATE_COLORS, EDGE_COLORS, COMPARE_COLORS, POINTER_PALETTE, HIGHLIGHT_RANGE_COLOR } from '../constants';
import { RendererProps } from './types';

const NODE_SIZE = 44;
const LEVEL_HEIGHT = 80;
const NODE_SPACING = 70;
const PAD = 40;

interface TreeNode {
  id: string;
  value: any;
  color: string;
  textColor: string;
  opacity: number;
  _fadingIn?: boolean;
}

interface TreeEdge {
  from: string;
  to: string;
  weight: number | null;
  color: string;
  opacity: number;
}

interface TreeState {
  nodes: Record<string, TreeNode>;
  edges: TreeEdge[];
  nodeLayout: Record<string, { x: number; y: number }>;
  pointers: Record<string, string>;
  levelHighlights: string[];
  annotations: Record<string, string>;
  elementGroups: Record<string, string>;
  rangeHighlights: string[];
  _pendingRemove?: string;
}

function buildTree(nodes: any[], edges: any[]) {
  const children: Record<string, string[]> = {}; const parents: Record<string, string> = {};
  nodes.forEach(n => { children[n.id] = []; });
  edges.forEach(e => { if (children[e.from]) children[e.from].push(e.to); if (parents[e.to] === undefined) parents[e.to] = e.from; });
  const root = nodes.find(n => parents[n.id] === undefined)?.id || nodes[0]?.id;
  return { children, root };
}

function computeLayout(nodes: any[], edges: any[]) {
  if (!nodes || nodes.length === 0) return {};
  const { children, root } = buildTree(nodes, edges);
  const positions: Record<string, { x: number, y: number }> = {}; let counter = { val: 0 };
  function assignX(nodeId: string, depth: number) {
    const kids = children[nodeId] || [];
    if (kids.length === 0) { positions[nodeId] = { x: counter.val * NODE_SPACING, y: depth * LEVEL_HEIGHT }; counter.val++; return; }
    for (const kid of kids) assignX(kid, depth + 1);
    const xs = kids.map(k => positions[k].x);
    positions[nodeId] = { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: depth * LEVEL_HEIGHT };
  }
  if (root) assignX(root, 0);
  nodes.forEach(n => { if (!positions[n.id]) { positions[n.id] = { x: counter.val * NODE_SPACING, y: 0 }; counter.val++; } });
  return positions;
}

function initState(config: any): TreeState {
  if (!config || !config.nodes) return { nodes: {}, edges: [], nodeLayout: {}, pointers: {}, levelHighlights: [], annotations: {}, elementGroups: {}, rangeHighlights: [] };
  const nodes: Record<string, TreeNode> = {};
  config.nodes.forEach((n: any) => { nodes[n.id] = { id: n.id, value: n.value ?? n.id, color: STATE_COLORS.default.bg, textColor: STATE_COLORS.default.text, opacity: 1 }; });
  const edges: TreeEdge[] = (config.edges || []).map((e: any) => ({ from: e.from, to: e.to, weight: e.weight ?? null, color: EDGE_COLORS.default, opacity: 1 }));
  const layout = computeLayout(config.nodes, config.edges || []);
  return { nodes, edges, nodeLayout: layout, pointers: {}, levelHighlights: [], annotations: {}, elementGroups: {}, rangeHighlights: [] };
}

function applyStepToState(state: TreeState, step: any, instant: boolean, isTopLevel = true): TreeState {
  if (!step) return state;
  if (isTopLevel) state = { ...state, annotations: {} };
  let { nodes, edges, pointers, annotations, elementGroups } = state;

  switch (step.type) {
    case 'visit': {
      const sc = (STATE_COLORS as any)[step.state] || STATE_COLORS.default;
      const newNodes = { ...nodes };
      if (newNodes[step.target]) newNodes[step.target] = { ...newNodes[step.target], color: sc.bg, textColor: sc.text };
      return { ...state, nodes: newNodes };
    }
    case 'compare': {
      let fc = COMPARE_COLORS.neutral;
      if (step.result === 'pass') fc = COMPARE_COLORS.pass;
      else if (step.result === 'fail') fc = COMPARE_COLORS.fail;
      const newNodes = { ...nodes };
      step.targets.forEach((id: string) => { if (newNodes[id]) newNodes[id] = { ...newNodes[id], color: fc, textColor: '#374151' }; });
      return { ...state, nodes: newNodes };
    }
    case 'value-update': {
      const newNodes = { ...nodes };
      if (newNodes[step.target]) newNodes[step.target] = { ...newNodes[step.target], value: step.value };
      return { ...state, nodes: newNodes };
    }
    case 'swap': {
      const [a, b] = step.targets; const newNodes = { ...nodes };
      if (newNodes[a] && newNodes[b]) { const tv = newNodes[a].value; newNodes[a] = { ...newNodes[a], value: newNodes[b].value }; newNodes[b] = { ...newNodes[b], value: tv }; }
      return { ...state, nodes: newNodes };
    }
    case 'fade-in': {
      const { target, value, edge: newEdge } = step;
      const newNodes = { ...nodes };
      newNodes[target] = { id: target, value: value ?? target, color: STATE_COLORS.default.bg, textColor: STATE_COLORS.default.text, opacity: instant ? 1 : 0, _fadingIn: !instant };
      const newEdges = [...edges];
      if (newEdge) newEdges.push({ from: newEdge.from, to: newEdge.to, weight: null, color: EDGE_COLORS.default, opacity: 1 });
      const allNodes = Object.values(newNodes).map((n) => ({ id: n.id, value: n.value }));
      const layout = computeLayout(allNodes, newEdges);
      return { ...state, nodes: newNodes, edges: newEdges, nodeLayout: layout };
    }
    case 'fade-out': {
      const newNodes = { ...nodes };
      if (newNodes[step.target]) newNodes[step.target] = { ...newNodes[step.target], opacity: 0 };
      return { ...state, nodes: newNodes, _pendingRemove: step.target };
    }
    case 'edge-update': {
      const [from, to] = step.edge;
      const ec = (EDGE_COLORS as any)[step.state] || EDGE_COLORS.default;
      const newEdges = edges.map((e) => e.from === from && e.to === to ? { ...e, color: ec } : e);
      return { ...state, edges: newEdges };
    }
    case 'weight-update': {
      const [from, to] = step.edge;
      const newEdges = edges.map((e) => e.from === from && e.to === to ? { ...e, weight: step.weight } : e);
      return { ...state, edges: newEdges };
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
        (s: TreeState, sub: any) => applyStepToState(s, sub, instant, false),
        state
      );
    }
    default: return state;
  }
}

function finalizePendingRemove(state: TreeState): TreeState {
  if (state._pendingRemove === undefined) return state;
  const target = state._pendingRemove;
  const newNodes = { ...state.nodes }; delete newNodes[target];
  const newEdges = state.edges.filter((e) => e.from !== target && e.to !== target);
  const allNodes = Object.values(newNodes).map((n) => ({ id: n.id, value: n.value }));
  const layout = computeLayout(allNodes, newEdges);
  return { ...state, nodes: newNodes, edges: newEdges, nodeLayout: layout, _pendingRemove: undefined };
}

function finalizeFadeIn(state: TreeState): TreeState {
  const newNodes: Record<string, TreeNode> = {}; let changed = false;
  Object.entries(state.nodes).forEach(([id, n]) => {
    if (n._fadingIn) { newNodes[id] = { ...n, opacity: 1, _fadingIn: false }; changed = true; }
    else newNodes[id] = n;
  });
  return changed ? { ...state, nodes: newNodes } : state;
}

export default function TreeRenderer({ config, steps, currentIndex, isSeek }: RendererProps) {
  const [state, setState] = useState(() => initState(config));
  useEffect(() => { setState(initState(config)); }, [config]);

  useEffect(() => {
    if (currentIndex < 0 || !steps) { setState(initState(config)); return; }
    if (isSeek) {
      let s = initState(config);
      for (let i = 0; i <= currentIndex; i++) {
        s = applyStepToState(s, steps[i], true);
        if (s._pendingRemove !== undefined) s = finalizePendingRemove(s);
        s = finalizeFadeIn(s);
      }
      setState(s);
    } else {
      setState(prev => { let s = finalizePendingRemove(prev); s = applyStepToState(s, steps[currentIndex], false); return s; });
      if (steps[currentIndex]?.type === 'fade-in') setTimeout(() => setState(prev => finalizeFadeIn(prev)), 50);
      if (steps[currentIndex]?.type === 'fade-out') setTimeout(() => setState(prev => finalizePendingRemove(prev)), 350);
    }
  }, [currentIndex, isSeek, config, steps]);

  const { nodes, edges, nodeLayout, pointers, levelHighlights, annotations, elementGroups, rangeHighlights } = state;
  const nodeList = Object.values(nodes);
  if (nodeList.length === 0) return <div style={{ color: '#9CA3AF', fontFamily: 'monospace', fontSize: 13 }}>No tree data</div>;

  const xs = nodeList.map((n: any) => nodeLayout[n.id]?.x ?? 0);
  const ys = nodeList.map((n: any) => nodeLayout[n.id]?.y ?? 0);
  const minX = Math.min(...xs), maxX = Math.max(...xs), maxY = Math.max(...ys);
  const w = maxX - minX + NODE_SIZE + PAD * 2;
  const h = maxY + NODE_SIZE + PAD * 2;
  const offsetX = PAD - minX; const offsetY = PAD;

  const levelMap: Record<number, string[]> = {};
  nodeList.forEach((n: any) => { const y = nodeLayout[n.id]?.y ?? 0; if (!levelMap[y]) levelMap[y] = []; levelMap[y].push(n.id); });

  const pointerEntries = Object.entries(pointers);
  const pointerColorMap: Record<string, string> = {};
  pointerEntries.forEach(([label], i) => { pointerColorMap[label] = POINTER_PALETTE[i % POINTER_PALETTE.length]; });

  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      {levelHighlights.map(nodeId => {
        const pos = nodeLayout[nodeId]; if (!pos) return null;
        const y = pos.y; const levelNodes = levelMap[y] || []; if (levelNodes.length === 0) return null;
        const lxs = levelNodes.map(id => (nodeLayout[id]?.x ?? 0) + offsetX);
        const lx = Math.min(...lxs) - 8; const lw = Math.max(...lxs) - lx + NODE_SIZE + 8;
        return <div key={`lh-${nodeId}`} style={{ position: 'absolute', left: lx, top: y + offsetY - 8,
          width: lw, height: NODE_SIZE + 16, background: 'rgba(254,243,199,0.5)', borderRadius: 8,
          pointerEvents: 'none', border: '1px dashed #F59E0B', zIndex: 0 }} />;
      })}
      {rangeHighlights.map(nodeId => {
        const pos = nodeLayout[nodeId]; if (!pos) return null;
        const y = pos.y; const levelNodes = levelMap[y] || []; if (levelNodes.length === 0) return null;
        const lxs = levelNodes.map(id => (nodeLayout[id]?.x ?? 0) + offsetX);
        const lx = Math.min(...lxs) - 8; const lw = Math.max(...lxs) - lx + NODE_SIZE + 8;
        return <div key={`rh-${nodeId}`} style={{ position: 'absolute', left: lx, top: y + offsetY - 8,
          width: lw, height: NODE_SIZE + 16, background: HIGHLIGHT_RANGE_COLOR.bg, borderRadius: 8,
          pointerEvents: 'none', border: `2px solid ${HIGHLIGHT_RANGE_COLOR.border}`, zIndex: 0 }} />;
      })}
      <svg style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }} width={w} height={h}>
        {edges.map((edge, i) => {
          const fp = nodeLayout[edge.from]; const tp = nodeLayout[edge.to];
          if (!fp || !tp) return null;
          return <AnimatedEdge key={`${edge.from}-${edge.to}-${i}`}
            x1={fp.x + offsetX + NODE_SIZE / 2} y1={fp.y + offsetY + NODE_SIZE / 2}
            x2={tp.x + offsetX + NODE_SIZE / 2} y2={tp.y + offsetY + NODE_SIZE / 2}
            color={edge.color} opacity={edge.opacity} directed={config?.directed ?? true}
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
