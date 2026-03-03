/**
 * Bridge to communicate with the visualization web worker
 */

import type { Command } from '@/lib/tracers';

export interface ExecutionResult {
  success: boolean;
  commands?: Command[];
  error?: string;
}

/**
 * Execute visualization code in a web worker
 * Returns the captured tracer commands
 */
export async function executeVisualizationCode(
  code: string,
  inputs?: Record<string, unknown>
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    // Create worker from the compiled worker file
    const worker = new Worker(
      new URL('./visualization-worker.ts', import.meta.url),
      { type: 'module' }
    );

    // Set up response handler
    worker.onmessage = (event) => {
      const { type, commands, error } = event.data;

      if (type === 'success') {
        resolve({ success: true, commands });
      } else {
        resolve({ success: false, error });
      }

      // Clean up worker
      worker.terminate();
    };

    // Handle worker errors
    worker.onerror = (error) => {
      resolve({
        success: false,
        error: error.message || 'Worker execution failed',
      });
      worker.terminate();
    };

    // Send code to worker
    worker.postMessage({ type: 'execute', code, inputs });
  });
}
