import { Tracer } from './tracer';

/**
 * Tracer for visualizing 1D arrays
 */
export class Array1DTracer extends Tracer {
  /**
   * Set an array to visualize
   */
  set(array1d?: any[]) {
    this.command('set', arguments);
  }

  /**
   * Notify that a value has been changed
   */
  patch(x: number, v?: any) {
    this.command('patch', arguments);
  }

  /**
   * Stop notifying that a value has been changed
   */
  depatch(x: number) {
    this.command('depatch', arguments);
  }

  /**
   * Select indices of the array
   */
  select(sx: number, ex?: number) {
    this.command('select', arguments);
  }

  /**
   * Stop selecting indices of the array
   */
  deselect(sx: number, ex?: number) {
    this.command('deselect', arguments);
  }

  /**
   * Link a ChartTracer for bar chart overlay
   */
  chart(chartTracer: any) {
    this.command('chart', arguments);
  }
}
