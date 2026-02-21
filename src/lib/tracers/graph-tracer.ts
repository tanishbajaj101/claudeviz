import { Tracer } from './tracer';

/**
 * Tracer for visualizing graphs
 */
export class GraphTracer extends Tracer {
  /**
   * Set an adjacency matrix to visualize
   */
  set(array2d?: any[][]) {
    this.command('set', arguments);
  }

  /**
   * Make the graph directed
   */
  directed(isDirected = true) {
    this.command('directed', arguments);
    return this;
  }

  /**
   * Make the graph weighted
   */
  weighted(isWeighted = true) {
    this.command('weighted', arguments);
    return this;
  }

  /**
   * Arrange nodes in a circular layout
   */
  layoutCircle() {
    this.command('layoutCircle', arguments);
    return this;
  }

  /**
   * Arrange nodes in a tree layout
   */
  layoutTree(root?: any, sorted?: boolean) {
    this.command('layoutTree', arguments);
    return this;
  }

  /**
   * Arrange nodes randomly
   */
  layoutRandom() {
    this.command('layoutRandom', arguments);
    return this;
  }

  /**
   * Add a node to the graph
   */
  addNode(id: any, weight?: any, x?: number, y?: number) {
    this.command('addNode', arguments);
  }

  /**
   * Update a node
   */
  updateNode(id: any, weight?: any, x?: number, y?: number) {
    this.command('updateNode', arguments);
  }

  /**
   * Remove a node
   */
  removeNode(id: any) {
    this.command('removeNode', arguments);
  }

  /**
   * Add an edge
   */
  addEdge(source: any, target: any, weight?: any) {
    this.command('addEdge', arguments);
  }

  /**
   * Update an edge
   */
  updateEdge(source: any, target: any, weight?: any) {
    this.command('updateEdge', arguments);
  }

  /**
   * Remove an edge
   */
  removeEdge(source: any, target: any) {
    this.command('removeEdge', arguments);
  }

  /**
   * Visit a node
   */
  visit(target: any, source?: any, weight?: any) {
    this.command('visit', arguments);
  }

  /**
   * Leave a node after visiting
   */
  leave(target: any, source?: any, weight?: any) {
    this.command('leave', arguments);
  }

  /**
   * Select a node
   */
  select(target: any, source?: any) {
    this.command('select', arguments);
  }

  /**
   * Deselect a node
   */
  deselect(target: any, source?: any) {
    this.command('deselect', arguments);
  }
}
