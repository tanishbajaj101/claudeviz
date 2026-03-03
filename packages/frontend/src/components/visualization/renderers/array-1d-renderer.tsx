'use client';

import { type Command } from '@/lib/tracers';
import { type ArrayElement } from './types';
import { BaseRenderer } from './base-renderer';

interface Array1DData {
  data: ArrayElement[][];
  title?: string;
}

/**
 * Process commands to build array state
 */
function processCommands(commands: Command[]): Array1DData {
  let data: ArrayElement[][] = [];
  let title: string | undefined;

  // Find the tracer key from first command
  const tracerKey = commands.find(c => c.key)?.key;

  for (const command of commands) {
    if (command.key !== tracerKey && command.method !== 'Array1DTracer') continue;

    const { method, args } = command;

    switch (method) {
      case 'Array1DTracer':
        title = args[0];
        break;

      case 'set':
        const array1d = args[0] || [];
        data = [array1d.map((value: any) => ({
          value,
          selected: false,
          patched: false,
        }))];
        break;

      case 'patch':
        const [x, v] = args;
        if (data[0] && data[0][x]) {
          data[0][x].value = v !== undefined ? v : data[0][x].value;
          data[0][x].patched = true;
        }
        break;

      case 'depatch':
        if (data[0] && data[0][args[0]]) {
          data[0][args[0]].patched = false;
        }
        break;

      case 'select':
        const [sx, ex] = args;
        const end = ex !== undefined ? ex : sx;
        for (let i = sx; i <= end && data[0]; i++) {
          if (data[0][i]) data[0][i].selected = true;
        }
        break;

      case 'deselect':
        const [dsx, dex] = args;
        const dend = dex !== undefined ? dex : dsx;
        for (let i = dsx; i <= dend && data[0]; i++) {
          if (data[0][i]) data[0][i].selected = false;
        }
        break;
    }
  }

  return { data, title };
}

/**
 * Format value for display
 */
function formatValue(value: any): string {
  switch (typeof value) {
    case 'number':
      if ([Infinity, Number.MAX_SAFE_INTEGER, 0x7fffffff].includes(value)) return '∞';
      if ([-Infinity, Number.MIN_SAFE_INTEGER, -0x80000000].includes(value)) return '-∞';
      return Number.isInteger(value) ? value.toString() : value.toFixed(3);
    case 'boolean':
      return value ? 'T' : 'F';
    default:
      return String(value);
  }
}

export interface Array1DRendererProps {
  commands: Command[];
  className?: string;
}

/**
 * Renders a 1D array with highlighting
 */
export function Array1DRenderer({ commands, className }: Array1DRendererProps) {
  const { data, title } = processCommands(commands);
  const row = data[0] || [];

  return (
    <BaseRenderer title={title} className={className}>
      <div className="flex flex-col items-center justify-center min-h-[120px]">
        {/* Index row */}
        <div className="flex gap-1 mb-2">
          {row.map((_, i) => (
            <div key={i} className="w-16 text-center text-xs text-gray-500 font-mono">
              {i}
            </div>
          ))}
        </div>

        {/* Values row */}
        <div className="flex gap-1">
          {row.map((cell, i) => {
            // Determine color based on state combinations
            let bgColor = 'bg-gray-800';
            let borderColor = 'border-gray-700';
            let textColor = 'text-gray-200';
            let shadow = '';
            let scale = '';

            if (cell.selected && cell.patched) {
              // Both selected AND patched (examining a modified value)
              bgColor = 'bg-purple-600';
              borderColor = 'border-purple-400';
              textColor = 'text-white';
              scale = 'scale-110';
              shadow = 'shadow-lg shadow-purple-500/50';
            } else if (cell.selected) {
              // Currently examining (BLUE - focus/inspection)
              bgColor = 'bg-blue-600';
              borderColor = 'border-blue-400';
              textColor = 'text-white';
              scale = 'scale-110';
              shadow = 'shadow-lg shadow-blue-500/50';
            } else if (cell.patched) {
              // Value was modified (PINK - changed state)
              bgColor = 'bg-pink-600';
              borderColor = 'border-pink-400';
              textColor = 'text-white';
            }

            return (
              <div
                key={i}
                className={`
                  w-16 h-16 flex items-center justify-center
                  font-mono text-sm font-semibold rounded-lg
                  border-2 transition-all duration-300
                  ${bgColor} ${borderColor} ${textColor} ${scale} ${shadow}
                `}
              >
                {formatValue(cell.value)}
              </div>
            );
          })}
        </div>
      </div>
    </BaseRenderer>
  );
}
