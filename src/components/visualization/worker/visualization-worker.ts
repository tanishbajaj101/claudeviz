/**
 * Web Worker for executing visualization code in isolation
 * Runs user's visualization JavaScript and captures tracer commands
 */

import { Commander } from '@/lib/tracers';
import { Array1DTracer } from '@/lib/tracers/array-1d-tracer';
import { Array2DTracer } from '@/lib/tracers/array-2d-tracer';
import { GraphTracer } from '@/lib/tracers/graph-tracer';
import { LogTracer } from '@/lib/tracers/log-tracer';
import { ChartTracer } from '@/lib/tracers/chart-tracer';
import { VerticalLayout, HorizontalLayout, Layout } from '@/lib/tracers/layout';
import { Tracer } from '@/lib/tracers/tracer';

export interface WorkerMessage {
  type: 'execute';
  code: string;
}

export interface WorkerResponse {
  type: 'success' | 'error';
  commands?: any[];
  error?: string;
}

// Handle messages from main thread
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, code } = event.data;

  if (type === 'execute') {
    try {
      // Initialize command collector
      Commander.init();

      // Create execution context with tracer library
      const context = {
        Array1DTracer,
        Array2DTracer,
        GraphTracer,
        LogTracer,
        ChartTracer,
        VerticalLayout,
        HorizontalLayout,
        Layout,
        Tracer,
        console: {
          log: () => {}, // Silent console in worker
          error: () => {},
          warn: () => {},
        },
      };

      // Execute the code with tracer context
      const func = new Function(...Object.keys(context), code);
      func(...Object.values(context));

      // Get captured commands
      const commands = Commander.getCommands();

      // Send success response
      const response: WorkerResponse = {
        type: 'success',
        commands,
      };
      self.postMessage(response);
    } catch (error) {
      // Send error response
      const response: WorkerResponse = {
        type: 'error',
        error: error instanceof Error ? error.message : String(error),
      };
      self.postMessage(response);
    }
  }
};

// Export for TypeScript
export {};
