import { type Command } from '@/lib/tracers';

/**
 * Chunk represents a single animation frame
 * Commands between delays are grouped into chunks
 */
export interface Chunk {
  commands: Command[];
  lineNumber?: number;
}

/**
 * Base props for all renderers
 */
export interface RendererProps {
  commands: Command[];
  className?: string;
}

/**
 * Array element with visualization state
 */
export interface ArrayElement {
  value: any;
  selected: boolean;
  patched: boolean;
}

/**
 * Graph node with position and state
 */
export interface GraphNode {
  id: any;
  weight: any;
  x: number;
  y: number;
  visitedCount: number;
  selectedCount: number;
}

/**
 * Graph edge with state
 */
export interface GraphEdge {
  source: any;
  target: any;
  weight: any;
  visitedCount: number;
  selectedCount: number;
}

/**
 * Split commands into animation chunks by delay() calls
 */
export function splitIntoChunks(commands: Command[]): Chunk[] {
  const chunks: Chunk[] = [{ commands: [], lineNumber: undefined }];

  for (const command of commands) {
    const { key, method, args } = command;

    if (key === null && method === 'delay') {
      const [lineNumber] = args;
      chunks[chunks.length - 1].lineNumber = lineNumber;
      chunks.push({ commands: [], lineNumber: undefined });
    } else {
      chunks[chunks.length - 1].commands.push(command);
    }
  }

  return chunks;
}
