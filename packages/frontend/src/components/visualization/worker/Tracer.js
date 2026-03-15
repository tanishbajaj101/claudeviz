class Tracer {
  constructor() {
    this.steps = [];
    this.type = null;
    this._multi = false;
    this._renderers = [];
  }

  _autoTreeEdges(nodes) {
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < nodes.length) edges.push({ from: nodes[i].id, to: nodes[l].id });
      if (r < nodes.length) edges.push({ from: nodes[i].id, to: nodes[r].id });
    }
    return edges;
  }

  init(configOrArray) {
    if (Array.isArray(configOrArray)) {
      this._multi = true;
      this._renderers = configOrArray.map(cfg => {
        const resolved = { ...cfg, type: this._inferType(cfg) };
        if (resolved.type === 'tree' && resolved.nodes && (!resolved.edges || resolved.edges.length === 0)) {
          resolved.edges = this._autoTreeEdges(resolved.nodes);
        }
        return resolved;
      });
      this.type = this._renderers[0]?.type || null;
      this.steps.push({
        type: "init",
        config: { type: "multi", layout: "horizontal", renderers: this._renderers },
      });
    } else {
      this.type = this._inferType(configOrArray);
      let cfg = { ...configOrArray, type: this.type };
      if (cfg.type === 'tree' && cfg.nodes && (!cfg.edges || cfg.edges.length === 0)) {
        cfg = { ...cfg, edges: this._autoTreeEdges(cfg.nodes) };
      }
      this.steps.push({ type: "init", config: cfg });
    }
  }

  _inferType(cfg) {
    if (cfg.type && cfg.type !== "multi") return cfg.type;
    if (cfg.type === 'recursive-linear') return 'recursive-linear';
    if (Array.isArray(cfg.data) && !Array.isArray(cfg.data[0])) return "linear";
    if (Array.isArray(cfg.data) && Array.isArray(cfg.data[0])) return "grid";
    if (cfg.nodes && cfg.parents) return "dsu";
    if (cfg.nodes && cfg.edges) return "graph";
    return "linear";
  }

  _tag(step, rendererId) {
    if (this._multi && rendererId != null) step._renderer = rendererId;
    return step;
  }

  _assert(allowedLayouts, rendererId) {
    let type = this.type;
    if (this._multi && rendererId != null) {
      const r = this._renderers.find(r => r.id === rendererId);
      if (r) type = r.type;
    }
    if (type && !allowedLayouts.includes(type)) {
      // throw new Error(`Method not supported on layout "${type}". Allowed: ${allowedLayouts.join(", ")}`);
      console.warn(`Method not supported on layout "${type}". Allowed: ${allowedLayouts.join(", ")}`);
    }
  }

  _push(step, rendererId) {
    this.steps.push(this._tag(step, rendererId ?? null));
  }

  subCreate(id, parentId, side, values, sourceRange = null) {
    this._push({ type: 'sub-create', id, parentId: parentId || null, side, values, sourceRange });
  }

  subDestroy(id) {
    this._push({ type: 'sub-destroy', id });
  }

  subVisit(subId, index, state = 'current') {
    this._push({ type: 'visit', target: index, state, subId });
  }

  subCompare(subId, a, b, result = null) {
    this._push({ type: 'compare', targets: [a, b], result, subId });
  }

  subPointer(subId, label, index) {
    this._push({ type: 'pointer', label, to: index, subId });
  }

  subValueUpdate(subId, index, value) {
    this._push({ type: 'value-update', target: index, value, subId });
  }

  subSwap(subId, i, j) {
    this._push({ type: 'swap', targets: [i, j], subId });
  }

  swap(i, j, rendererId = null) {
    this._assert(["linear", "grid", "tree"], rendererId);
    this.steps.push(this._tag({ type: "swap", targets: [i, j] }, rendererId));
  }

  batchShift(start, end, direction = "right", rendererId = null) {
    this._assert(["linear"], rendererId);
    this.steps.push(this._tag({ type: "batch-shift", range: [start, end], direction }, rendererId));
  }

  fadeIn(target, opts = {}, rendererId = null) {
    this._assert(["linear", "tree", "graph", "linked-list", "grid"], rendererId);
    this.steps.push(this._tag({ type: "fade-in", target, ...opts }, rendererId));
  }

  fadeOut(target, rendererId = null) {
    this._assert(["linear", "tree", "graph", "linked-list", "grid"], rendererId);
    this.steps.push(this._tag({ type: "fade-out", target }, rendererId));
  }

  visit(target, state = "current", rendererId = null) {
    this.steps.push(this._tag({ type: "visit", target, state }, rendererId));
  }

  pointer(label, target, rendererId = null) {
    this.steps.push(this._tag({ type: "pointer", label, to: target }, rendererId));
  }

  compare(targets, result = null, rendererId = null) {
    this.steps.push(this._tag({ type: "compare", targets, result }, rendererId));
  }

  searchNarrow(start, end, rendererId = null) {
    this._assert(["linear"], rendererId);
    this.steps.push(this._tag({ type: "search-narrow", active: [start, end] }, rendererId));
  }

  recursionPush(label, args) {
    this.steps.push({ type: "recursion-push", frame: { label, args } });
  }

  recursionPop(returnValue = null) {
    this.steps.push({ type: "recursion-pop", returnValue });
  }

  valueUpdate(target, value, rendererId = null) {
    this.steps.push(this._tag({ type: "value-update", target, value }, rendererId));
  }

  edgeUpdate(from, to, state = "exploring", rendererId = null) {
    this._assert(["tree", "graph", "linked-list"], rendererId);
    this.steps.push(this._tag({ type: "edge-update", edge: [from, to], state }, rendererId));
  }

  reparent(target, newParent, rendererId = null) {
    this._assert(['dsu'], rendererId);
    this.steps.push(this._tag(
      { type: 'reparent', target: String(target), newParent: String(newParent) },
      rendererId
    ));
  }

  levelHighlight(targets, rendererId = null) {
    this._assert(["tree", "graph"], rendererId);
    this.steps.push(this._tag({ type: "level-highlight", targets }, rendererId));
  }

  annotate(target, text, rendererId = null) {
    this._push({ type: 'annotate', target, text: text ?? null }, rendererId);
  }

  weightUpdate(from, to, weight, rendererId = null) {
    this._push({ type: 'weight-update', edge: [from, to], weight }, rendererId);
  }

  group(targets, color, rendererId = null) {
    this._push({ type: 'group', targets: targets ?? null, color: color ?? null }, rendererId);
  }

  highlightRange(targets, rendererId = null) {
    this._push({ type: 'highlight-range', targets: targets ?? [] }, rendererId);
  }

  getSteps() {
    return this.steps;
  }
}

export default Tracer;
