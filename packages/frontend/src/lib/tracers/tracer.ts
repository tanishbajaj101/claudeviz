import { Commander } from './commander';

/**
 * Base class for all visualization tracers
 */
export abstract class Tracer extends Commander {
  /**
   * Create a tracer with optional title
   */
  constructor(title?: string) {
    super(arguments);
  }

  /**
   * Pause execution to show changes in all tracers
   * This creates a breakpoint in the animation
   */
  static delay(lineNumber?: number) {
    this.command(null, 'delay', arguments);
  }

  /**
   * Reset the tracer to initial state
   */
  reset() {
    this.command('reset', arguments);
  }
}
