import { useEffect, useState } from 'react';
import AnimatedElement from '../ui/AnimatedElement';
import AnimatedEdge from '../ui/AnimatedEdge';
import PointerLabel from '../ui/PointerLabel';
import { STATE_COLORS, COMPARE_COLORS, POINTER_PALETTE } from '../constants';
import { RendererProps } from './types';

const NODE_SIZE = 44;
const LEVEL_HEIGHT = 80;
const NODE_SPACING = 70;
const TREE_GAP = 60;
const PAD = 40;

function computeDSULayout(parents: Record<string, string>, nodeIds: string[]) {
  const children: Record<string, string[]> = {};
  nodeIds.forEach(id => { children[id] = []; });
  nodeIds.forEach(id => {
    const p = parents[id];
    if (p !== id && children[p] !== undefined) {
      children[p].push(id);
    }
  });

  const roots = nodeIds.filter(id => parents[id] === id)
    .sort((a, b) => Number(a) - Number(b));

  const positions: Record<string, { x: number, y: number }> = {};
  const counter = { val: 0 };

  function assignX(nodeId: string, depth: number) {
    const kids = children[nodeId] || [];
    if (kids.length === 0) {
      positions[nodeId] = { x: counter.val * NODE_SPACING, y: depth * LEVEL_HEIGHT };
      counter.val++;
      return;
    }
    for (const kid of kids) {
      assignX(kid, depth + 1);
    }
    const xs = kids.map(k => positions[k].x);
    positions[nodeId] = {
      x: (Math.min(...xs) + Math.max(...xs)) / 2,
      y: depth * LEVEL_HEIGHT,
    };
  }

  roots.forEach((root, i) => {
    assignX(root, 0);
    if (i < roots.length - 1) {
      counter.val += Math.round(TREE_GAP / NODE_SPACING);
    }
  });

  return positions;
}

function initState(config: any) {
  if (!config || !config.nodes) {
    return { nodes: {} as Record<string, any>, parents: {} as Record<string, string>, nodeLayout: {} as Record<string, any>, pointers: {} as Record<string, string> };
  }
  const nodes: Record<string, any> = {};
  config.nodes.forEach((n: any) => {
    nodes[n.id] = {
      id: n.id,
      value: n.value ?? n.id,
      color: STATE_COLORS.default.bg,
      textColor: STATE_COLORS.default.text,
      opacity: 1,
    };
  });
  const parents = { ...(config.parents || {}) };
  const nodeIds = Object.keys(nodes);
  const nodeLayout = computeDSULayout(parents, nodeIds);
  return { nodes, parents, nodeLayout, pointers: {} as Record<string, string> };
}

function applyStepToState(state: any, step: any, _instant: boolean) {
  if (!step) return state;
  const { nodes, parents, pointers } = state;

  switch (step.type) {
    case 'visit': {
      const sc = (STATE_COLORS as any)[step.state] || STATE_COLORS.default;
      const newNodes = { ...nodes };
      if (newNodes[step.target]) {
        newNodes[step.target] = {
          ...newNodes[step.target],
          color: sc.bg,
          textColor: sc.text,
        };
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

    case 'pointer': {
      const { label, to } = step;
      if (to === null || to === undefined) {
        const np = { ...pointers };
        delete np[label];
        return { ...state, pointers: np };
      }
      return { ...state, pointers: { ...pointers, [label]: to } };
    }

    case 'reparent': {
      const newParents = { ...parents, [step.target]: step.newParent };
      return {
        ...state,
        parents: newParents,
        nodeLayout: computeDSULayout(newParents, Object.keys(nodes)),
      };
    }

    default:
      return state;
  }
}

export default function DSURenderer({ config, steps, currentIndex, isSeek }: RendererProps) {
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
      }
      setState(s);
    } else {
      setState(prev => applyStepToState(prev, steps[currentIndex], false));
    }
  }, [currentIndex, isSeek, config, steps]);

  const { nodes, parents, nodeLayout, pointers } = state;

  const nodeList = Object.values(nodes);
  if (nodeList.length === 0) {
    return <div style={{ color: '#9CA3AF', fontFamily: 'monospace', fontSize: 13 }}>No DSU data</div>;
  }

  const xs = nodeList.map(n => nodeLayout[n.id]?.x ?? 0);
  const ys = nodeList.map(n => nodeLayout[n.id]?.y ?? 0);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const w = maxX - minX + NODE_SIZE + PAD * 2;
  const h = maxY + NODE_SIZE + PAD * 2;

  const offsetX = PAD - minX;
  const offsetY = PAD;

  const pointerEntries = Object.entries(pointers);
  const pointerColorMap: Record<string, string> = {};
  pointerEntries.forEach(([label], i) => {
    pointerColorMap[label] = POINTER_PALETTE[i % POINTER_PALETTE.length];
  });

  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      {/* SVG for edges — derived from parents at render time */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
        width={w}
        height={h}
      >
        {nodeList.map(node => {
          const parentId = parents[node.id];
          if (!parentId || parentId === node.id) return null;
          const fromPos = nodeLayout[parentId];
          const toPos = nodeLayout[node.id];
          if (!fromPos || !toPos) return null;
          return (
            <AnimatedEdge
              key={`${parentId}-${node.id}`}
              x1={fromPos.x + offsetX + NODE_SIZE / 2}
              y1={fromPos.y + offsetY + NODE_SIZE / 2}
              x2={toPos.x + offsetX + NODE_SIZE / 2}
              y2={toPos.y + offsetY + NODE_SIZE / 2}
              color="#94A3B8"
              opacity={1}
              directed={true}
              instant={isSeek}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodeList.map(node => {
        const pos = nodeLayout[node.id];
        if (!pos) return null;
        const isRoot = parents[node.id] === node.id;
        return (
          <div key={node.id}>
            <AnimatedElement
              x={pos.x + offsetX}
              y={pos.y + offsetY}
              value={node.value}
              color={node.color}
              textColor={node.textColor}
              opacity={node.opacity}
              size={NODE_SIZE}
              instant={isSeek}
            />
            {isRoot && (
              <div style={{
                position: 'absolute',
                left: pos.x + offsetX,
                top: pos.y + offsetY,
                width: NODE_SIZE,
                height: NODE_SIZE,
                borderRadius: 6,
                border: '2px solid #6366F1',
                boxSizing: 'border-box',
                pointerEvents: 'none',
                zIndex: 2,
                transition: isSeek ? 'none' : 'left 300ms ease-out, top 300ms ease-out',
              }} />
            )}
          </div>
        );
      })}

      {/* Pointers */}
      {pointerEntries.map(([label, targetId]) => {
        const pos = nodeLayout[targetId];
        if (!pos) return null;
        return (
          <PointerLabel
            key={label}
            label={label}
            x={pos.x + offsetX + NODE_SIZE / 2}
            y={pos.y + offsetY}
            color={pointerColorMap[label]}
            position="above"
            instant={isSeek}
          />
        );
      })}
    </div>
  );
}
