import { Tracer } from './tracer';

/**
 * Tracer for logging text output
 */
export class LogTracer extends Tracer {
  /**
   * Set initial log content
   */
  set(log?: string) {
    this.command('set', arguments);
  }

  /**
   * Print message without line break
   */
  print(message: any) {
    this.command('print', arguments);
  }

  /**
   * Print message with line break
   */
  println(message: any) {
    this.command('println', arguments);
  }

  /**
   * Print formatted message (sprintf-style)
   */
  printf(format: string, ...args: any[]) {
    this.command('printf', arguments);
  }
}
