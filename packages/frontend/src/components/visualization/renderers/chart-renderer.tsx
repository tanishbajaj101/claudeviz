'use client';

import { type Command } from '@/lib/tracers';
import { type ArrayElement } from './types';
import { BaseRenderer } from './base-renderer';

interface ChartData {
  data: ArrayElement[][];
  title?: string;
}

/**
 * Process commands (same as Array1D)
 */
function processCommands(commands: Command[]): ChartData {
  let data: ArrayElement[][] = [];
  let title: string | undefined;

  const tracerKey = commands.find(c => c.key)?.key;

  for (const command of commands) {
    if (command.key !== tracerKey && command.method !== 'ChartTracer') continue;

    const { method, args } = command;

    switch (method) {
      case 'ChartTracer':
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

export interface ChartRendererProps {
  commands: Command[];
  className?: string;
}

/**
 * Renders data as a bar chart
 */
export function ChartRenderer({ commands, className }: ChartRendererProps) {
  const { data, title } = processCommands(commands);
  const values = data[0] || [];

  if (!values.length) {
    return (
      <BaseRenderer title={title} className={className}>
        <div className="flex items-center justify-center h-full text-gray-500">
          No data
        </div>
      </BaseRenderer>
    );
  }

  const maxValue = Math.max(...values.map(v => Number(v.value) || 0), 1);
  const minValue = Math.min(...values.map(v => Number(v.value) || 0), 0);
  const range = maxValue - minValue || 1;

  return (
    <BaseRenderer title={title} className={className}>
      <div className="flex flex-col h-full min-h-[200px]">
        <div className="flex-1 flex items-end gap-1 px-4">
          {values.map((item, i) => {
            const numValue = Number(item.value) || 0;
            const heightPercent = Math.abs(numValue - minValue) / range * 100;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-gray-400 font-mono h-4">
                  {numValue}
                </div>
                <div
                  className={`
                    w-full transition-all duration-300 rounded-t
                    ${item.selected
                      ? 'bg-blue-500 shadow-lg shadow-blue-500/50'
                      : item.patched
                      ? 'bg-green-500'
                      : 'bg-gray-600'
                    }
                  `}
                  style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                />
                <div className="text-xs text-gray-500 font-mono h-4">
                  {i}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BaseRenderer>
  );
}
