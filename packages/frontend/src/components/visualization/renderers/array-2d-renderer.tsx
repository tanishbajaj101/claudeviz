'use client';

import { type Command } from '@/lib/tracers';
import { type ArrayElement } from './types';
import { BaseRenderer } from './base-renderer';

interface Array2DData {
  data: ArrayElement[][];
  title?: string;
}

/**
 * Process commands to build 2D array state
 */
function processCommands(commands: Command[]): Array2DData {
  let data: ArrayElement[][] = [];
  let title: string | undefined;

  const tracerKey = commands.find(c => c.key)?.key;

  for (const command of commands) {
    if (command.key !== tracerKey && command.method !== 'Array2DTracer') continue;

    const { method, args } = command;

    switch (method) {
      case 'Array2DTracer':
        title = args[0];
        break;

      case 'set':
        const array2d = args[0] || [];
        data = array2d.map((row: any[]) =>
          row.map(value => ({
            value,
            selected: false,
            patched: false,
          }))
        );
        break;

      case 'patch':
        const [x, y, v] = args;
        if (data[x] && data[x][y]) {
          data[x][y].value = v !== undefined ? v : data[x][y].value;
          data[x][y].patched = true;
        }
        break;

      case 'depatch':
        if (data[args[0]] && data[args[0]][args[1]]) {
          data[args[0]][args[1]].patched = false;
        }
        break;

      case 'select':
      case 'selectRow':
      case 'selectCol':
        const [sx, sy, ex, ey] = args;
        const startX = method === 'selectCol' ? sy : sx;
        const startY = method === 'selectCol' ? sx : sy;
        const endX = method === 'selectCol' ? (ey !== undefined ? ey : sy) : (ex !== undefined ? ex : sx);
        const endY = method === 'selectCol' ? sx : (ey !== undefined ? ey : (method === 'selectRow' ? sy : sy));

        for (let i = startX; i <= endX && i < data.length; i++) {
          for (let j = startY; j <= endY && data[i] && j < data[i].length; j++) {
            if (data[i][j]) data[i][j].selected = true;
          }
        }
        break;

      case 'deselect':
      case 'deselectRow':
      case 'deselectCol':
        const [dsx, dsy, dex, dey] = args;
        const dstartX = method === 'deselectCol' ? dsy : dsx;
        const dstartY = method === 'deselectCol' ? dsx : dsy;
        const dendX = method === 'deselectCol' ? (dey !== undefined ? dey : dsy) : (dex !== undefined ? dex : dsx);
        const dendY = method === 'deselectCol' ? dsx : (dey !== undefined ? dey : (method === 'deselectRow' ? dsy : dsy));

        for (let i = dstartX; i <= dendX && i < data.length; i++) {
          for (let j = dstartY; j <= dendY && data[i] && j < data[i].length; j++) {
            if (data[i][j]) data[i][j].selected = false;
          }
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
      return Number.isInteger(value) ? value.toString() : value.toFixed(2);
    case 'boolean':
      return value ? 'T' : 'F';
    default:
      return String(value);
  }
}

export interface Array2DRendererProps {
  commands: Command[];
  className?: string;
}

/**
 * Renders a 2D array/matrix with highlighting
 */
export function Array2DRenderer({ commands, className }: Array2DRendererProps) {
  const { data, title } = processCommands(commands);

  if (!data.length) {
    return (
      <BaseRenderer title={title} className={className}>
        <div className="flex items-center justify-center h-full text-gray-500">
          No data
        </div>
      </BaseRenderer>
    );
  }

  const maxCols = Math.max(...data.map(row => row.length));

  return (
    <BaseRenderer title={title} className={className}>
      <div className="inline-block">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="w-12 h-8 text-xs text-gray-500 font-mono"></th>
              {Array.from({ length: maxCols }, (_, i) => (
                <th key={i} className="w-12 h-8 text-xs text-gray-500 font-mono">
                  {i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td className="w-12 h-12 text-xs text-gray-500 font-mono text-center">
                  {i}
                </td>
                {row.map((cell, j) => {
                  // Determine color based on state combinations
                  let bgColor = 'bg-gray-800';
                  let borderColor = 'border-gray-700';
                  let textColor = 'text-gray-200';
                  let shadow = '';
                  let scale = '';

                  if (cell.selected && cell.patched) {
                    // Both selected AND patched
                    bgColor = 'bg-purple-600';
                    borderColor = 'border-purple-400';
                    textColor = 'text-white';
                    scale = 'scale-110';
                    shadow = 'shadow-lg shadow-purple-500/50';
                  } else if (cell.selected) {
                    // Currently examining (BLUE)
                    bgColor = 'bg-blue-600';
                    borderColor = 'border-blue-400';
                    textColor = 'text-white';
                    scale = 'scale-110';
                    shadow = 'shadow-lg shadow-blue-500/50';
                  } else if (cell.patched) {
                    // Value was modified (PINK)
                    bgColor = 'bg-pink-600';
                    borderColor = 'border-pink-400';
                    textColor = 'text-white';
                  }

                  return (
                    <td key={j} className="p-0.5">
                      <div
                        className={`
                          w-12 h-12 flex items-center justify-center
                          font-mono text-xs font-semibold rounded
                          border-2 transition-all duration-300
                          ${bgColor} ${borderColor} ${textColor} ${scale} ${shadow}
                        `}
                      >
                        {formatValue(cell.value)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BaseRenderer>
  );
}
