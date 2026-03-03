'use client';

import { type Command } from '@/lib/tracers';
import { BaseRenderer } from './base-renderer';

interface LogData {
  log: string;
  title?: string;
}

/**
 * Process commands to build log output
 * Returns the full log and the number of lines from previous steps
 */
function processCommands(commands: Command[], currentStepCommands?: Command[]): { log: string; title?: string; currentStepStartLine: number } {
  let log = '';
  let title: string | undefined;

  console.log('[LogRenderer] Processing', commands.length, 'commands');

  // Find the LogTracer's key specifically — prevents picking up Array1DTracer
  // or other tracer keys, which would cause non-string args to reach log.split()
  const tracerKey = commands.find(c => c.method === 'LogTracer')?.key;

  const allMethods = [...new Set(commands.map(c => c.method))];
  console.log('[LogRenderer] All methods:', allMethods);
  console.log('[LogRenderer] LogTracer key:', tracerKey);
  console.log('[LogRenderer] Commands with LogTracer key:',
    commands.filter(c => c.key === tracerKey).length
  );

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

  console.log('[LogRenderer] Final log length:', log.length);
  console.log('[LogRenderer] Log content:', log.substring(0, 200));

  // Calculate where the current step starts
  let currentStepStartLine = 0;
  if (currentStepCommands && currentStepCommands.length > 0) {
    // Process commands up to (but not including) current step
    const prevCommands = commands.slice(0, commands.length - currentStepCommands.length);
    const prevLog = processCommandsToLog(prevCommands, tracerKey);
    currentStepStartLine = prevLog.split('\n').length - 1; // -1 because split adds empty line at end
    console.log('[LogRenderer] Current step starts at line:', currentStepStartLine);
  }

  return { log, title, currentStepStartLine };
}

/**
 * Helper to process commands into just the log string
 */
function processCommandsToLog(commands: Command[], tracerKey: string | undefined | null): string {
  let log = '';

  for (const command of commands) {
    if (command.key !== tracerKey && command.method !== 'LogTracer') continue;

    const { method, args } = command;

    switch (method) {
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

  return log;
}

export interface LogRendererProps {
  commands: Command[];
  currentStepCommands?: Command[];
  className?: string;
}

/**
 * Format log line with color coding based on content
 */
function formatLogLine(line: string, index: number, isCurrentStep: boolean) {
  const trimmed = line.trim();

  // Empty lines
  if (!trimmed) {
    return <div key={index} className="h-2" />;
  }

  // Base classes for highlighting current step
  const highlightClasses = isCurrentStep
    ? 'bg-blue-900/30 border-l-2 border-l-blue-500 pl-2 -ml-2'
    : 'opacity-60';

  // Success/completion markers
  if (trimmed.startsWith('✓') || trimmed.includes('Found') || trimmed.includes('Success')) {
    return (
      <div key={index} className={`text-green-400 font-medium ${highlightClasses}`}>
        {line}
      </div>
    );
  }

  // Error/warning markers
  if (trimmed.startsWith('✗') || trimmed.startsWith('⚠') || trimmed.includes('FAIL')) {
    return (
      <div key={index} className={`text-red-400 font-medium ${highlightClasses}`}>
        {line}
      </div>
    );
  }

  // Headers (all caps or ends with colon)
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
    return (
      <div key={index} className={`text-blue-400 font-bold mt-2 ${highlightClasses}`}>
        {line}
      </div>
    );
  }

  // Step indicators
  if (trimmed.match(/^(Step|Pass|Iteration|Round)\s+\d+/i)) {
    return (
      <div key={index} className={`text-cyan-400 font-medium mt-1 ${highlightClasses}`}>
        {line}
      </div>
    );
  }

  // Color indicators (BLUE, PINK, etc.)
  if (trimmed.includes('🔵') || trimmed.includes('🩷') || trimmed.includes('🟣')) {
    return (
      <div key={index} className={`text-yellow-400 italic ${highlightClasses}`}>
        {line}
      </div>
    );
  }

  // Arrows and directional indicators
  if (trimmed.includes('→') || trimmed.includes('←') || trimmed.includes('↑') || trimmed.includes('↓')) {
    return (
      <div key={index} className={`text-purple-400 ${highlightClasses}`}>
        {line}
      </div>
    );
  }

  // Default
  return (
    <div key={index} className={`text-gray-300 ${highlightClasses}`}>
      {line}
    </div>
  );
}

/**
 * Renders console/log output with syntax highlighting
 */
export function LogRenderer({ commands, currentStepCommands, className }: LogRendererProps) {
  const { log, title, currentStepStartLine } = processCommands(commands, currentStepCommands);

  if (!log) {
    return (
      <BaseRenderer title={title || 'Algorithm Steps'} className={className}>
        <div className="text-yellow-600 text-sm">
          <p className="font-semibold">⚠️ No explanations generated</p>
          <p className="text-xs mt-1 text-gray-400">
            The visualization was generated without step-by-step text explanations.
            The visual animation shows the algorithm behavior.
          </p>
        </div>
      </BaseRenderer>
    );
  }

  const lines = log.split('\n');

  return (
    <BaseRenderer title={title || 'Algorithm Steps'} className={className}>
      <div className="font-mono text-sm space-y-0.5 max-h-96 overflow-y-auto">
        {lines.map((line, index) => {
          const isCurrentStep = currentStepCommands && currentStepCommands.length > 0 && index >= currentStepStartLine;
          return formatLogLine(line, index, isCurrentStep);
        })}
      </div>
    </BaseRenderer>
  );
}
