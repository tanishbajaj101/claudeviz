import { Commander } from './commander';
import { Tracer } from './tracer';

/**
 * Base class for layouts that contain multiple tracers
 */
export abstract class Layout extends Commander {
  /**
   * Create a layout with child tracers
   */
  constructor(children: (Layout | Tracer)[]) {
    super(arguments);
  }

  /**
   * Set the root view for visualization
   */
  static setRoot(root: Layout | Tracer) {
    this.command(null, 'setRoot', arguments);
  }

  /**
   * Add a child to the layout
   */
  add(child: Layout | Tracer, index?: number) {
    this.command('add', arguments);
  }

  /**
   * Remove a child from the layout
   */
  remove(child: Layout | Tracer) {
    this.command('remove', arguments);
  }

  /**
   * Remove all children
   */
  removeAll() {
    this.command('removeAll', arguments);
  }
}

/**
 * Vertical layout - stacks tracers vertically
 */
export class VerticalLayout extends Layout {}

/**
 * Horizontal layout - arranges tracers horizontally
 */
export class HorizontalLayout extends Layout {}
