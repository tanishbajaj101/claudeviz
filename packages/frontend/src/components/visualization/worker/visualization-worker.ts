/**
 * Web Worker for executing visualization code in isolation
 * Runs user's visualization JavaScript and captures tracer steps
 */

import Tracer from './Tracer';

export interface WorkerMessage {
  type: 'execute';
  code: string;
  inputs?: Record<string, any>;
}

export interface WorkerResponse {
  type: 'success' | 'error';
  config?: any;
  steps?: any[];
  error?: string;
}

// Handle messages from main thread
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, code, inputs } = event.data;

  if (type === 'execute') {
    const tracer = new Tracer();

    const timeout = setTimeout(() => {
      self.postMessage({ type: 'error', error: "Execution timed out after 5 seconds." });
    }, 5000);

    try {
      // Define context for the function
      // Inject inputs as the INPUTS object
      const fn = new Function("tracer", "INPUTS", code);
      fn(tracer, inputs || {});
      
      clearTimeout(timeout);

      const steps = (tracer as any).getSteps();
      if (steps.length === 0) {
        self.postMessage({ type: 'error', error: "No tracer calls found. Make sure to call tracer.init()." });
        return;
      }
      if (steps[0].type !== "init") {
        self.postMessage({ type: 'error', error: "First tracer call must be tracer.init(config)." });
        return;
      }

      self.postMessage({ 
        type: 'success', 
        config: steps[0].config, 
        steps: steps.slice(1) 
      });
    } catch (err) {
      clearTimeout(timeout);
      self.postMessage({ 
        type: 'error', 
        error: err instanceof Error ? err.message : String(err) 
      });
    }
  }
};

// Export for TypeScript
export {};
