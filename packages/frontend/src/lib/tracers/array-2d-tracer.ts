import { Tracer } from './tracer';

/**
 * Tracer for visualizing 2D arrays
 */
export class Array2DTracer extends Tracer {
  /**
   * Set a two-dimensional array to visualize
   */
  set(array2d?: any[][]) {
    this.command('set', arguments);
  }

  /**
   * Notify that a value has been changed
   */
  patch(x: number, y: number, v?: any) {
    this.command('patch', arguments);
  }

  /**
   * Stop notifying that a value has been changed
   */
  depatch(x: number, y: number) {
    this.command('depatch', arguments);
  }

  /**
   * Select indices of the array
   */
  select(sx: number, sy: number, ex?: number, ey?: number) {
    this.command('select', arguments);
  }

  /**
   * Select a row of the array
   */
  selectRow(x: number, sy: number, ey: number) {
    this.command('selectRow', arguments);
  }

  /**
   * Select a column of the array
   */
  selectCol(y: number, sx: number, ex: number) {
    this.command('selectCol', arguments);
  }

  /**
   * Stop selecting indices
   */
  deselect(sx: number, sy: number, ex?: number, ey?: number) {
    this.command('deselect', arguments);
  }

  /**
   * Stop selecting a row
   */
  deselectRow(x: number, sy: number, ey: number) {
    this.command('deselectRow', arguments);
  }

  /**
   * Stop selecting a column
   */
  deselectCol(y: number, sx: number, ex: number) {
    this.command('deselectCol', arguments);
  }
}
