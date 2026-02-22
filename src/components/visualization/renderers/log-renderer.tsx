'use client';

import { type Command } from '@/lib/tracers';
import { BaseRenderer } from './base-renderer';

interface LogData {
  log: string;
  title?: string;
}

/**
 * Process commands to build log output
 */
function processCommands(commands: Command[]): LogData {
  let log = '';
  let title: string | undefined;

  // Find the LogTracer's key specifically — prevents picking up Array1DTracer
  // or other tracer keys, which would cause non-string args to reach log.split()
  const tracerKey = commands.find(c => c.method === 'LogTracer')?.key;

  for (const command of commands) {
    if (command.key !== tracerKey && command.method !== 'LogTracer') continue;

    const { method, args } = command;

    switch (method) {
      case 'LogTracer':
        title = args[0];
        break;

      case 'set':
        log = String(args[0] ?? '');
        break;

      case 'print':
        log += String(args[0]);
        break;

      case 'println':
        log += String(args[0]) + '\n';
        break;

      case 'printf': {
        const format = String(args[0] ?? '');
        const printfArgs = args.slice(1);
        let result = format;
        printfArgs.forEach((arg: unknown) => {
          result = result.replace(/%[sdif]/, String(arg));
        });
        log += result;
        break;
      }
    }
  }

  return { log, title };
}

export interface LogRendererProps {
  commands: Command[];
  className?: string;
}

/**
 * Format log line with color coding based on content
 */
function formatLogLine(line: string, index: number) {
  const trimmed = line.trim();

  // Empty lines
  if (!trimmed) {
    return <div key={index} className="h-2" />;
  }

  // Success/completion markers
  if (trimmed.startsWith('✓') || trimmed.includes('Found') || trimmed.includes('Success')) {
    return (
      <div key={index} className="text-green-400 font-medium">
        {line}
      </div>
    );
  }

  // Error/warning markers
  if (trimmed.startsWith('✗') || trimmed.startsWith('⚠') || trimmed.includes('FAIL')) {
    return (
      <div key={index} className="text-red-400 font-medium">
        {line}
      </div>
    );
  }

  // Headers (all caps or ends with colon)
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
    return (
      <div key={index} className="text-blue-400 font-bold mt-2">
        {line}
      </div>
    );
  }

  // Step indicators
  if (trimmed.match(/^(Step|Pass|Iteration|Round)\s+\d+/i)) {
    return (
      <div key={index} className="text-cyan-400 font-medium mt-1">
        {line}
      </div>
    );
  }

  // Color indicators (BLUE, PINK, etc.)
  if (trimmed.includes('🔵') || trimmed.includes('🩷') || trimmed.includes('🟣')) {
    return (
      <div key={index} className="text-yellow-400 italic">
        {line}
      </div>
    );
  }

  // Arrows and directional indicators
  if (trimmed.includes('→') || trimmed.includes('←') || trimmed.includes('↑') || trimmed.includes('↓')) {
    return (
      <div key={index} className="text-purple-400">
        {line}
      </div>
    );
  }

  // Default
  return (
    <div key={index} className="text-gray-300">
      {line}
    </div>
  );
}

/**
 * Renders console/log output with syntax highlighting
 */
export function LogRenderer({ commands, className }: LogRendererProps) {
  const { log, title } = processCommands(commands);

  if (!log) {
    return (
      <BaseRenderer title={title || 'Algorithm Steps'} className={className}>
        <div className="text-gray-600 text-sm italic">No steps logged</div>
      </BaseRenderer>
    );
  }

  const lines = log.split('\n');

  return (
    <BaseRenderer title={title || 'Algorithm Steps'} className={className}>
      <div className="font-mono text-sm space-y-0.5 max-h-96 overflow-y-auto">
        {lines.map((line, index) => formatLogLine(line, index))}
      </div>
    </BaseRenderer>
  );
}
