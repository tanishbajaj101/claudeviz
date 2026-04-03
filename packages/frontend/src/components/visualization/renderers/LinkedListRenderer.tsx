import { useEffect, useState } from 'react';
import AnimatedElement from '../ui/AnimatedElement';
import AnimatedEdge from '../ui/AnimatedEdge';
import PointerLabel from '../ui/PointerLabel';
import { STATE_COLORS, EDGE_COLORS, COMPARE_COLORS, POINTER_PALETTE } from '../constants';
import { RendererProps } from './types';

const NODE_SIZE = 48;
const NODE_SPACING = 110;
const PAD_X = 20;
const PAD_Y = 60;
const CONTAINER_H = 180;

interface LinkedListNode {
  id: string;
  value: any;
  color: string;
  textColor: string;
  opacity: number;
  _fadingIn?: boolean;
}

interface LinkedListEdge {
  from: string;
  to: string;
  color: string;
  opacity: number;
}

interface LinkedListState {
  nodes: Record<string, LinkedListNode>;
  order: string[];
  edges: LinkedListEdge[];
  pointers: Record<string, string>;
  _pendingRemove?: string;
}

function initState(config: any): LinkedListState {
  if (!config || !config.nodes) return { nodes: {}, order: [], edges: [], pointers: {} };

  const nodeMap: Record<string, LinkedListNode> = {};
  config.nodes.forEach((n: any) => {
    nodeMap[n.id] = {
      id: n.id,
      value: n.value ?? n.id,
      color: STATE_COLORS.default.bg,
      textColor: STATE_COLORS.default.text,
      opacity: 1,
    };
  });

  // Build order from edges (linked list chain)
  const nextMap: Record<string, string> = {};
  const prevSet = new Set();
  (config.edges || []).forEach((e: any) => {
    nextMap[e.from] = e.to;
    prevSet.add(e.to);
  });

  // Find head: node with no incoming edge
  let head = config.nodes.find((n: any) => !prevSet.has(n.id))?.id;
  const order: string[] = [];
  const visited = new Set();
  let cur = head;
  while (cur && !visited.has(cur)) {
    order.push(cur);
    visited.add(cur);
    cur = nextMap[cur];
  }
  // Add any remaining nodes not in chain
  config.nodes.forEach((n: any) => {
    if (!visited.has(n.id)) order.push(n.id);
  });

  const edges: LinkedListEdge[] = (config.edges || []).map((e: any) => ({
    from: e.from,
    to: e.to,
    color: EDGE_COLORS.default,
    opacity: 1,
  }));

  return { nodes: nodeMap, order, edges, pointers: {} };
}

function applyStepToState(state: LinkedListState, step: any, instant: boolean): LinkedListState {
  if (!step) return state;
  let { nodes, order, edges, pointers } = state;

  switch (step.type) {
    case 'visit': {
      const sc = (STATE_COLORS as any)[step.state] || STATE_COLORS.default;
      const newNodes = { ...nodes };
      if (newNodes[step.target]) {
        newNodes[step.target] = { ...newNodes[step.target], color: sc.bg, textColor: sc.text };
      }
      return { ...state, nodes: newNodes };
    }

    case 'compare': {
      let flashColor = COMPARE_COLORS.neutral;
      if (step.result === 'pass') flashColor = COMPARE_COLORS.pass;
      else if (step.result === 'fail') flashColor = COMPARE_COLORS.fail;
      const newNodes = { ...nodes };
      step.targets.forEach((id: string) => {
        if (newNodes[id]) {
          newNodes[id] = { ...newNodes[id], color: flashColor, textColor: '#374151' };
        }
      });
      return { ...state, nodes: newNodes };
    }

    case 'value-update': {
      const newNodes = { ...nodes };
      if (newNodes[step.target]) {
        newNodes[step.target] = { ...newNodes[step.target], value: step.value };
      }
      return { ...state, nodes: newNodes };
    }

    case 'fade-in': {
      const { target, value } = step;
      const insertAfter = step.after ?? null;
      const newNodes = { ...nodes, [target]: {
        id: target,
        value: value ?? target,
        color: STATE_COLORS.default.bg,
        textColor: STATE_COLORS.default.text,
        opacity: instant ? 1 : 0,
        _fadingIn: !instant,
      }};
      const newOrder = [...order];
      if (insertAfter !== null) {
        const idx = newOrder.indexOf(insertAfter);
        newOrder.splice(idx + 1, 0, target);
      } else {
        newOrder.push(target);
      }
      // Rebuild edges based on order
      const newEdges: LinkedListEdge[] = [];
      for (let i = 0; i < newOrder.length - 1; i++) {
        const existing = edges.find((e) => e.from === newOrder[i] && e.to === newOrder[i + 1]);
        newEdges.push(existing || { from: newOrder[i], to: newOrder[i + 1], color: EDGE_COLORS.default, opacity: 1 });
      }
      return { ...state, nodes: newNodes, order: newOrder, edges: newEdges };
    }

    case 'fade-out': {
      const target = step.target;
      const newNodes = { ...nodes };
      if (newNodes[target]) {
        newNodes[target] = { ...newNodes[target], opacity: 0 };
      }
      return { ...state, nodes: newNodes, _pendingRemove: target };
    }

    case 'edge-update': {
      const [from, to] = step.edge;
      const edgeColor = (EDGE_COLORS as any)[step.state] || EDGE_COLORS.default;
      const newEdges = edges.map((e) => {
        if (e.from === from && e.to === to) return { ...e, color: edgeColor };
        return e;
      });
      return { ...state, edges: newEdges };
    }

    case 'pointer': {
      const { label, to } = step;
      if (to === null || to === undefined) {
        const np = { ...pointers };
        delete np[label];
        return { ...state, pointers: np };
      }
      return { ...state, pointers: { ...pointers, [label]: to } };
    }

    default:
      return state;
  }
}

function finalizePendingRemove(state: LinkedListState): LinkedListState {
  if (state._pendingRemove === undefined) return state;
  const target = state._pendingRemove;
  const newNodes = { ...state.nodes };
  delete newNodes[target];
  const newOrder = state.order.filter((id) => id !== target);
  const newEdges: LinkedListEdge[] = [];
  for (let i = 0; i < newOrder.length - 1; i++) {
    newEdges.push({ from: newOrder[i], to: newOrder[i + 1], color: EDGE_COLORS.default, opacity: 1 });
  }
  return { ...state, nodes: newNodes, order: newOrder, edges: newEdges, _pendingRemove: undefined };
}

function finalizeFadeIn(state: LinkedListState): LinkedListState {
  const newNodes: Record<string, LinkedListNode> = {};
  let changed = false;
  Object.entries(state.nodes).forEach(([id, n]) => {
    if (n._fadingIn) {
      newNodes[id] = { ...n, opacity: 1, _fadingIn: false };
      changed = true;
    } else {
      newNodes[id] = n;
    }
  });
  return changed ? { ...state, nodes: newNodes } : state;
}

export default function LinkedListRenderer({ config, steps, currentIndex, isSeek }: RendererProps) {
  const [state, setState] = useState(() => initState(config));

  useEffect(() => {
    setState(initState(config));
  }, [config]);

  useEffect(() => {
    if (currentIndex < 0 || !steps) {
      setState(initState(config));
      return;
    }
    if (isSeek) {
      let s = initState(config);
      for (let i = 0; i <= currentIndex; i++) {
        s = applyStepToState(s, steps[i], true);
        if (s._pendingRemove !== undefined) s = finalizePendingRemove(s);
        s = finalizeFadeIn(s);
      }
      setState(s);
    } else {
      setState(prev => {
        let s = finalizePendingRemove(prev);
        return applyStepToState(s, steps[currentIndex], false);
      });
      if (steps[currentIndex]?.type === 'fade-in') {
        setTimeout(() => setState(prev => finalizeFadeIn(prev)), 50);
      }
      if (steps[currentIndex]?.type === 'fade-out') {
        setTimeout(() => setState(prev => finalizePendingRemove(prev)), 350);
      }
    }
  }, [currentIndex, isSeek, config, steps]);

  const { nodes, order, edges, pointers } = state;

  if (order.length === 0) return <div style={{ color: '#9CA3AF', fontFamily: 'monospace', fontSize: 13 }}>No linked list data</div>;

  const totalW = PAD_X * 2 + order.length * NODE_SPACING + 60; // extra for null
  const nodeY = PAD_Y;

  const pointerEntries = Object.entries(pointers);
  const pointerColorMap: Record<string, string> = {};
  pointerEntries.forEach(([label], i) => {
    pointerColorMap[label] = POINTER_PALETTE[i % POINTER_PALETTE.length];
  });

  const getNodeX = (idx: number) => PAD_X + idx * NODE_SPACING;

  // SVG edge positions: center of each node
  const nodeCX = (idx: number) => getNodeX(idx) + NODE_SIZE / 2;
  const nodeCY = nodeY + NODE_SIZE / 2;

  return (
    <div style={{ position: 'relative', width: totalW, height: CONTAINER_H }}>
      {/* SVG edges */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
        width={totalW}
        height={CONTAINER_H}
      >
        {order.slice(0, -1).map((id, i) => {
          const edge = edges.find((e) => e.from === id && e.to === order[i + 1]);
          const edgeColor = edge?.color || EDGE_COLORS.default;
          return (
            <AnimatedEdge
              key={`edge-${id}-${order[i + 1]}`}
              x1={nodeCX(i) + NODE_SIZE / 2 - 4}
              y1={nodeCY}
              x2={nodeCX(i + 1) - NODE_SIZE / 2 + 4}
              y2={nodeCY}
              color={edgeColor}
              directed={true}
              instant={isSeek}
            />
          );
        })}
        {/* Arrow to null */}
        {order.length > 0 && (
          <line
            x1={nodeCX(order.length - 1) + NODE_SIZE / 2 - 4}
            y1={nodeCY}
            x2={nodeCX(order.length - 1) + NODE_SIZE / 2 + 30}
            y2={nodeCY}
            stroke={EDGE_COLORS.default}
            strokeWidth={2}
          />
        )}
      </svg>

      {/* Nodes */}
      {order.map((id, i) => {
        const node = nodes[id];
        if (!node) return null;
        return (
          <AnimatedElement
            key={id}
            x={getNodeX(i)}
            y={nodeY}
            value={node.value}
            color={node.color}
            textColor={node.textColor}
            opacity={node.opacity}
            size={NODE_SIZE}
            instant={isSeek}
          />
        );
      })}

      {/* Null indicator */}
      <div
        style={{
          position: 'absolute',
          left: getNodeX(order.length) + 8,
          top: nodeY + NODE_SIZE / 2 - 10,
          fontFamily: 'monospace',
          fontSize: 13,
          color: '#9CA3AF',
          fontWeight: 600,
        }}
      >
        null
      </div>

      {/* Index labels */}
      {order.map((id, i) => (
        <div
          key={`lbl-${id}`}
          style={{
            position: 'absolute',
            left: getNodeX(i),
            top: nodeY + NODE_SIZE + 4,
            width: NODE_SIZE,
            textAlign: 'center',
            fontSize: 10,
            color: '#9CA3AF',
            fontFamily: 'monospace',
            transition: isSeek ? 'none' : 'left 300ms ease-out',
          }}
        >
          {i}
        </div>
      ))}

      {/* Pointers */}
      {pointerEntries.map(([label, targetId]) => {
        const idx = order.indexOf(targetId as string);
        if (idx === -1) return null;
        return (
          <PointerLabel
            key={label}
            label={label}
            x={getNodeX(idx) + NODE_SIZE / 2}
            y={nodeY}
            color={pointerColorMap[label]}
            position="above"
            instant={isSeek}
          />
        );
      })}
    </div>
  );
}
