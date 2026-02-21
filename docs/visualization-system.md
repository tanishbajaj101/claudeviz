# Visualization System Documentation

## Overview

AlgoArena's visualization system enables algorithm animations through tracer commands executed in a web worker. The chatbot generates JavaScript code that uses the tracer API, which is then rendered as interactive step-by-step animations.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Chatbot (Viz Agent)                      │
│  Generates JavaScript code using tracer API                 │
└─────────────────────────┬───────────────────────────────────┘
                          │ returns { type, code, description }
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Web Worker Bridge                         │
│  executeVisualizationCode(code) → Command[]                 │
└─────────────────────────┬───────────────────────────────────┘
                          │ executes in isolation
                          ▼
┌─────────────────────────────────────────────────────────────┐
│               Visualization Web Worker                      │
│  • Executes JS code with tracer library                     │
│  • Captures Commander.commands[]                            │
│  • Returns serialized commands to main thread               │
└─────────────────────────┬───────────────────────────────────┘
                          │ Command[] with animation steps
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                 VisualizationPlayer                         │
│  • Splits commands into chunks (by delay() calls)           │
│  • Play/pause/step controls                                 │
│  • Speed adjustment (0.25x - 4x)                            │
│  • Progress bar                                             │
└─────────────────────────┬───────────────────────────────────┘
                          │ renders current chunk
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     Renderers                               │
│  Array1D • Array2D • Graph • Log • Chart                    │
│  Process commands → visual representation                   │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── lib/tracers/                    # Tracer library (command generation)
│   ├── commander.ts                # Base command collector
│   ├── tracer.ts                   # Base tracer class
│   ├── array-1d-tracer.ts          # 1D array tracer
│   ├── array-2d-tracer.ts          # 2D array/matrix tracer
│   ├── graph-tracer.ts             # Graph/tree tracer
│   ├── log-tracer.ts               # Console output tracer
│   ├── chart-tracer.ts             # Bar chart tracer
│   ├── layout.ts                   # Layout containers
│   └── index.ts                    # Public exports
│
└── components/visualization/
    ├── renderers/                  # Visual renderers
    │   ├── types.ts                # Shared types
    │   ├── base-renderer.tsx       # Base renderer component
    │   ├── array-1d-renderer.tsx   # 1D array visualization
    │   ├── array-2d-renderer.tsx   # 2D array/matrix visualization
    │   ├── graph-renderer.tsx      # Graph visualization (SVG)
    │   ├── log-renderer.tsx        # Console log display
    │   ├── chart-renderer.tsx      # Bar chart display
    │   └── index.ts                # Public exports
    │
    ├── player/                     # Animation controller
    │   └── visualization-player.tsx
    │
    ├── worker/                     # Web worker execution
    │   ├── visualization-worker.ts # Worker script
    │   └── worker-bridge.ts        # Main thread interface
    │
    └── index.ts                    # Public exports
```

## Tracer API Reference

### Core Classes

**Tracer** (base class)
- `static delay(lineNumber?: number)` — Create animation breakpoint

**Array1DTracer** — 1D array visualization
- `set(array: any[])` — Set array data
- `select(start: number, end?: number)` — Highlight elements (blue)
- `deselect(start: number, end?: number)` — Unhighlight elements
- `patch(index: number, value?: any)` — Mark element as changed (green)
- `depatch(index: number)` — Unmark changed element

**Array2DTracer** — 2D array/matrix visualization
- `set(array: any[][])` — Set 2D array data
- `select(sx, sy, ex?, ey?)` — Highlight cells
- `selectRow(x, sy, ey)` — Highlight row range
- `selectCol(y, sx, ex)` — Highlight column range
- `deselect(...)` — Unhighlight cells
- `patch(x, y, value?)` — Mark cell as changed
- `depatch(x, y)` — Unmark changed cell

**GraphTracer** — Graph/tree visualization
- `set(adjacencyMatrix: number[][])` — Initialize from adj matrix
- `directed(isDirected = true)` — Set directed/undirected
- `weighted(isWeighted = true)` — Show edge weights
- `layoutCircle()` — Circular node layout
- `layoutTree(root?, sorted?)` — Tree layout
- `addNode(id, weight?, x?, y?)` — Add node
- `addEdge(source, target, weight?)` — Add edge
- `visit(target, source?, weight?)` — Mark node visited (green)
- `leave(target, source?, weight?)` — Unmark visited
- `select(target, source?)` — Highlight node (blue)
- `deselect(target, source?)` — Unhighlight node

**LogTracer** — Console output
- `set(log: string)` — Set initial log
- `print(message)` — Print without newline
- `println(message)` — Print with newline
- `printf(format, ...args)` — Printf-style formatting

**ChartTracer** — Bar chart (extends Array1DTracer)
- Same API as Array1DTracer, but renders as bar chart

**Layout** — Container for multiple tracers
- `static setRoot(layout)` — Set root layout
- `VerticalLayout([tracers])` — Stack vertically
- `HorizontalLayout([tracers])` — Arrange horizontally

## Usage Example

### Chatbot Generates This Code:

```javascript
const { Array1DTracer, Tracer } = require('algorithm-visualizer');

const arr = [5, 2, 8, 1, 9];
const tracer = new Array1DTracer('Binary Search');

tracer.set(arr);
Tracer.delay();

let left = 0, right = arr.length - 1;
const target = 8;

while (left <= right) {
  const mid = Math.floor((left + right) / 2);

  tracer.select(mid);
  Tracer.delay();

  if (arr[mid] === target) {
    tracer.patch(mid);
    Tracer.delay();
    break;
  } else if (arr[mid] < target) {
    tracer.deselect(mid);
    left = mid + 1;
  } else {
    tracer.deselect(mid);
    right = mid - 1;
  }

  Tracer.delay();
}
```

### What Happens:

1. **Web Worker** executes code with tracer library
2. **Commander** collects commands:
   ```json
   [
     { "key": "abc123", "method": "Array1DTracer", "args": ["Binary Search"] },
     { "key": "abc123", "method": "set", "args": [[5,2,8,1,9]] },
     { "key": null, "method": "delay", "args": [] },
     { "key": "abc123", "method": "select", "args": [2] },
     { "key": null, "method": "delay", "args": [] },
     // ... more commands
   ]
   ```

3. **VisualizationPlayer** splits commands into chunks at `delay()` calls

4. **Array1DRenderer** processes commands and renders each frame:
   - Frame 1: Show array `[5, 2, 8, 1, 9]`
   - Frame 2: Highlight index 2 (value 8)
   - Frame 3: Mark index 2 as patched (found!)

## Color Scheme

| State | Color | Meaning |
|-------|-------|---------|
| Default | Gray (`bg-gray-800`) | Normal state |
| Selected | Blue (`bg-blue-500`) | Currently examining |
| Patched | Green (`bg-green-500`) | Modified/found |
| Visited (Graph) | Green | Node visited |

## Chatbot Integration

The Visualization Agent (see `docs/visualization-agent-prompt.md`) generates code that:

1. Imports tracers from 'algorithm-visualizer' (mocked in worker)
2. Creates tracer instances
3. Uses tracer methods to annotate algorithm steps
4. Calls `Tracer.delay()` between animation frames

The Main Agent triggers the Viz Agent when:
- User asks to "visualize" or "animate"
- Explanation would benefit from visual demonstration
- User's approach is incorrect (show correct approach visually)

## Performance

- **Web Worker Isolation**: Code runs in separate thread, can't block UI
- **Command Limit**: Max 1,000,000 commands (prevents infinite loops)
- **Object Limit**: Max 100 tracer objects (prevents memory issues)
- **Animation Speed**: 0.25x to 4x playback speed

## Future Enhancements

- [ ] ScatterTracer for 2D point visualization
- [ ] Custom color schemes
- [ ] Export animation as GIF/video
- [ ] Breakpoint debugging (pause at specific lines)
- [ ] Step-over vs step-into for nested calls
- [ ] Timeline scrubbing with thumbnails
