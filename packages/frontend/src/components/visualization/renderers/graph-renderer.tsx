'use client';

import { type Command } from '@/lib/tracers';
import { type GraphNode, type GraphEdge } from './types';
import { BaseRenderer } from './base-renderer';

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected: boolean;
  isWeighted: boolean;
  title?: string;
}

const DIMENSIONS = {
  baseWidth: 320,
  baseHeight: 320,
  padding: 32,
  nodeRadius: 12,
  arrowGap: 4,
};

/**
 * Calculate circular layout positions
 */
function layoutCircle(nodes: GraphNode[]) {
  const rect = {
    left: -DIMENSIONS.baseWidth / 2 + DIMENSIONS.padding,
    top: -DIMENSIONS.baseHeight / 2 + DIMENSIONS.padding,
    width: DIMENSIONS.baseWidth - 2 * DIMENSIONS.padding,
    height: DIMENSIONS.baseHeight - 2 * DIMENSIONS.padding,
  };

  const unitAngle = (2 * Math.PI) / nodes.length;
  let angle = -Math.PI / 2;

  nodes.forEach(node => {
    node.x = Math.cos(angle) * (rect.width / 2);
    node.y = Math.sin(angle) * (rect.height / 2);
    angle += unitAngle;
  });
}

/**
 * Process commands to build graph state
 */
function processCommands(commands: Command[]): GraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  let isDirected = true;
  let isWeighted = false;
  let title: string | undefined;
  let layoutMethod = 'circle';

  const tracerKey = commands.find(c => c.key)?.key;

  const findNode = (id: any) => nodes.find(n => n.id === id);
  const findEdge = (source: any, target: any) =>
    edges.find(e => e.source === source && e.target === target);

  for (const command of commands) {
    if (command.key !== tracerKey && command.method !== 'GraphTracer') continue;

    const { method, args } = command;

    switch (method) {
      case 'GraphTracer':
        title = args[0];
        break;

      case 'set':
        const matrix = args[0] || [];
        nodes.length = 0;
        edges.length = 0;

        matrix.forEach((row: any[], i: number) => {
          nodes.push({ id: i, weight: null, x: 0, y: 0, visitedCount: 0, selectedCount: 0 });
          row.forEach((value: any, j: number) => {
            if (value) {
              edges.push({
                source: i,
                target: j,
                weight: isWeighted ? value : null,
                visitedCount: 0,
                selectedCount: 0,
              });
            }
          });
        });
        layoutCircle(nodes);
        break;

      case 'directed':
        isDirected = args[0] !== false;
        break;

      case 'weighted':
        isWeighted = args[0] !== false;
        break;

      case 'layoutCircle':
        layoutMethod = 'circle';
        layoutCircle(nodes);
        break;

      case 'addNode':
        const [id, weight, x, y] = args;
        if (!findNode(id)) {
          nodes.push({
            id,
            weight: weight !== undefined ? weight : null,
            x: x !== undefined ? x : 0,
            y: y !== undefined ? y : 0,
            visitedCount: 0,
            selectedCount: 0,
          });
          if (layoutMethod === 'circle') layoutCircle(nodes);
        }
        break;

      case 'updateNode':
        const node = findNode(args[0]);
        if (node) {
          if (args[1] !== undefined) node.weight = args[1];
          if (args[2] !== undefined) node.x = args[2];
          if (args[3] !== undefined) node.y = args[3];
        }
        break;

      case 'removeNode':
        const nodeIdx = nodes.findIndex(n => n.id === args[0]);
        if (nodeIdx !== -1) {
          nodes.splice(nodeIdx, 1);
          if (layoutMethod === 'circle') layoutCircle(nodes);
        }
        break;

      case 'addEdge':
        const [source, target, edgeWeight] = args;
        if (!findEdge(source, target)) {
          edges.push({
            source,
            target,
            weight: edgeWeight !== undefined ? edgeWeight : null,
            visitedCount: 0,
            selectedCount: 0,
          });
        }
        break;

      case 'updateEdge':
        const edge = findEdge(args[0], args[1]);
        if (edge && args[2] !== undefined) {
          edge.weight = args[2];
        }
        break;

      case 'removeEdge':
        const edgeIdx = edges.findIndex(e => e.source === args[0] && e.target === args[1]);
        if (edgeIdx !== -1) edges.splice(edgeIdx, 1);
        break;

      case 'visit':
        const [vTarget, vSource, vWeight] = args;
        const vEdge = findEdge(vSource, vTarget);
        if (vEdge) vEdge.visitedCount++;
        const vNode = findNode(vTarget);
        if (vNode) {
          if (vWeight !== undefined) vNode.weight = vWeight;
          vNode.visitedCount++;
        }
        break;

      case 'leave':
        const [lTarget, lSource, lWeight] = args;
        const lEdge = findEdge(lSource, lTarget);
        if (lEdge) lEdge.visitedCount--;
        const lNode = findNode(lTarget);
        if (lNode) {
          if (lWeight !== undefined) lNode.weight = lWeight;
          lNode.visitedCount--;
        }
        break;

      case 'select':
        const [sTarget, sSource] = args;
        const sEdge = findEdge(sSource, sTarget);
        if (sEdge) sEdge.selectedCount++;
        const sNode = findNode(sTarget);
        if (sNode) sNode.selectedCount++;
        break;

      case 'deselect':
        const [dTarget, dSource] = args;
        const dEdge = findEdge(dSource, dTarget);
        if (dEdge) dEdge.selectedCount--;
        const dNode = findNode(dTarget);
        if (dNode) dNode.selectedCount--;
        break;
    }
  }

  return { nodes, edges, isDirected, isWeighted, title };
}

export interface GraphRendererProps {
  commands: Command[];
  className?: string;
}

/**
 * Renders a graph with nodes and edges
 */
export function GraphRenderer({ commands, className }: GraphRendererProps) {
  const { nodes, edges, isDirected, isWeighted, title } = processCommands(commands);

  const viewBox = [
    -DIMENSIONS.baseWidth / 2,
    -DIMENSIONS.baseHeight / 2,
    DIMENSIONS.baseWidth,
    DIMENSIONS.baseHeight,
  ].join(' ');

  return (
    <BaseRenderer title={title} className={className}>
      <div className="flex items-center justify-center min-h-[320px]">
        <svg viewBox={viewBox} className="w-full max-w-md">
          <defs>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,8 L8,4 z" fill="#6b7280" />
            </marker>
            <marker
              id="arrow-selected"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,8 L8,4 z" fill="#3b82f6" />
            </marker>
            <marker
              id="arrow-visited"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,8 L8,4 z" fill="#10b981" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge, i) => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const dx = targetNode.x - sourceNode.x;
            const dy = targetNode.y - sourceNode.y;
            const length = Math.sqrt(dx * dx + dy * dy);

            let ex = targetNode.x;
            let ey = targetNode.y;

            if (isDirected && length > 0) {
              const offset = DIMENSIONS.nodeRadius + DIMENSIONS.arrowGap;
              ex = sourceNode.x + (dx / length) * (length - offset);
              ey = sourceNode.y + (dy / length) * (length - offset);
            }

            const markerEnd = isDirected
              ? edge.selectedCount > 0
                ? 'url(#arrow-selected)'
                : edge.visitedCount > 0
                ? 'url(#arrow-visited)'
                : 'url(#arrow)'
              : undefined;

            return (
              <g key={`${edge.source}-${edge.target}-${i}`}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={ex}
                  y2={ey}
                  stroke={
                    edge.selectedCount > 0
                      ? '#3b82f6'
                      : edge.visitedCount > 0
                      ? '#10b981'
                      : '#6b7280'
                  }
                  strokeWidth={edge.selectedCount > 0 || edge.visitedCount > 0 ? 3 : 2}
                  markerEnd={markerEnd}
                />
                {isWeighted && edge.weight !== null && (
                  <text
                    x={(sourceNode.x + targetNode.x) / 2}
                    y={(sourceNode.y + targetNode.y) / 2}
                    fill="#9ca3af"
                    fontSize="10"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(node => (
            <g key={node.id} transform={`translate(${node.x},${node.y})`}>
              <circle
                r={DIMENSIONS.nodeRadius}
                fill={
                  node.selectedCount > 0
                    ? '#3b82f6'
                    : node.visitedCount > 0
                    ? '#10b981'
                    : '#1f2937'
                }
                stroke={
                  node.selectedCount > 0
                    ? '#60a5fa'
                    : node.visitedCount > 0
                    ? '#34d399'
                    : '#4b5563'
                }
                strokeWidth="2"
              />
              <text
                fill="white"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {node.id}
              </text>
              {isWeighted && node.weight !== null && (
                <text
                  x={DIMENSIONS.nodeRadius + 4}
                  fill="#9ca3af"
                  fontSize="9"
                  textAnchor="start"
                  dominantBaseline="middle"
                >
                  {node.weight}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </BaseRenderer>
  );
}
