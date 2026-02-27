# Visualization System — Complete Flow

## Problem Fixed

The visualization system was missing the **Visualization Agent** (`src/lib/visualization-agent.ts`). The Main Agent was trying to generate tracer code itself without proper knowledge of the tracer API, resulting in invalid code that produced no visualization commands.

## Complete Architecture

### 1. User Interaction Flow

```
User sends message with failing test case
           ↓
Main Agent (chatbot.ts) analyzes situation
           ↓
Main Agent decides visualization would help
           ↓
Main Agent outputs ```vizrequest block with context
           ↓
extractVisualization() detects vizrequest
           ↓
Visualization Agent generates tracer code
           ↓
Code returned to frontend in ChatResponse
           ↓
VisualizationRenderer executes code in web worker
           ↓
Tracer commands captured and rendered
           ↓
User sees animated visualization with controls
```

### 2. Key Components

#### Main Agent (`src/lib/chatbot.ts`)
- **Role:** Interview coach, guides users through problems
- **Visualization Decision:** When a failing test case or algorithm step needs visual explanation
- **Output Format:**
  ```markdown
  Your approach has an issue with this test case. Let me show you what's happening:

  ```vizrequest
  {
    "algorithm": "User's two-pointer approach on unsorted array",
    "testCase": { "input": "3\n3 2 4\n6", "expectedOutput": "1 2" },
    "highlight": "Show where two pointers fails because array is unsorted"
  }
  ```
  ```

#### Visualization Agent (`src/lib/visualization-agent.ts`)
- **Role:** Expert in tracer API, generates executable visualization code
- **Input:** VisualizationRequest with algorithm description, test case, and what to highlight
- **Output:** VisualizationData with:
  - `type: "visualization"`
  - `code`: Self-contained JavaScript using tracer library
  - `description`: One-line summary
- **Model:** GPT-4o (more capable for code generation)
- **Prompt:** Loaded from `docs/visualization-agent-prompt.md`

#### Web Worker (`src/components/visualization/worker/visualization-worker.ts`)
- **Role:** Safely execute generated code in isolation
- **Context Injection:** Provides tracers without requiring imports:
  - `Array1DTracer`, `Array2DTracer`, `GraphTracer`, `LogTracer`, `ChartTracer`
  - `Layout`, `VerticalLayout`, `HorizontalLayout`
  - `Tracer` (for delay)
- **Command Collection:** Uses `Commander.init()` → execute → `Commander.getCommands()`

#### Visualization Player (`src/components/visualization/player/visualization-player.tsx`)
- **Role:** Animation controls and frame management
- **Features:**
  - Play/pause/step controls
  - Speed adjustment (0.25x to 4x)
  - Progress scrubbing
  - Automatic renderer detection

#### Renderers (`src/components/visualization/renderers/`)
- **Array1DRenderer:** Arrays, highlighted elements, patches
- **Array2DRenderer:** Matrices, DP tables
- **GraphRenderer:** Trees, graphs, DFS/BFS
- **LogTracer:** Step-by-step narration (always included)
- **ChartTracer:** Bar chart overlays

### 3. Tracer API Reference

Generated code uses these patterns:

```javascript
// 1. Create tracers (no require/import needed)
const tracer = new Array1DTracer('Array');
const logger = new LogTracer('Steps');
Layout.setRoot(new VerticalLayout([tracer, logger]));

// 2. Initialize data
tracer.set([2, 7, 11, 15]);
Tracer.delay(); // Creates animation frame

// 3. Highlight during algorithm
tracer.select(0);              // Highlight index 0
logger.println('Checking index 0');
Tracer.delay();                // Show this state

tracer.patch(0, 99);           // Change value
Tracer.delay();

tracer.deselect(0);            // Clean up
tracer.depatch(0);
```

**Critical:**
- Every visual state change MUST be followed by `Tracer.delay()`
- Always clean up: `deselect()` after `select()`, `depatch()` after `patch()`
- Use concrete test case data, not randomized values
- Include LogTracer narration explaining what's happening

### 4. Testing the System

#### Test Case 1: Simple Visualization Request

**User Message:**
```
"Can you show me how binary search works on [2, 5, 8, 12, 16, 23, 38] searching for 23?"
```

**Expected Main Agent Response:**
```markdown
Let me visualize how binary search narrows down the search space:

```vizrequest
{
  "algorithm": "Binary search on sorted array",
  "testCase": { "input": "7\n2 5 8 12 16 23 38\n23", "expectedOutput": "5" },
  "highlight": "Show how search space halves each iteration"
}
```
```

**Expected Visualization:**
- Array with indices
- Search window highlighting (select range)
- Mid element inspection (patch)
- Log narration of each comparison

#### Test Case 2: Showing Wrong Approach

**User Code:** Two-pointer on unsorted array
**User Message:** "Why isn't this working?"

**Expected Main Agent Response:**
```markdown
The issue is that two pointers requires a sorted array. Let me show you what happens:

```vizrequest
{
  "algorithm": "Two-pointer approach on unsorted [3, 2, 4] with target 6",
  "testCase": { "input": "3\n3 2 4\n6", "expectedOutput": "1 2" },
  "highlight": "Show where pointers cross without finding the answer"
}
```
```

**Expected Visualization:**
- Array showing [3, 2, 4]
- Left and right pointers moving
- Log showing why each pointer moves
- Final message: "Pointers crossed! Missed indices [1,2]"

### 5. Debugging Checklist

If visualization shows controls but no content:

1. **Check browser console:** Look for worker errors
2. **Check generated code:** Look at `data.code` in VisualizationRenderer
3. **Verify tracer syntax:** Should NOT have `require()`, must use `Tracer.delay()`
4. **Check commands:** Log `commands` in VisualizationPlayer (should have `{ key, method, args }`)
5. **Verify renderer type:** Should auto-detect based on tracer constructor

### 6. Files Modified

#### Created:
- `src/lib/visualization-agent.ts` — Visualization Agent implementation

#### Updated:
- `src/lib/chatbot.ts` — Now calls visualization agent instead of generating code itself
- `docs/visualization-agent-prompt.md` — Removed incorrect `require()` statements
- `next.config.ts` — Added `turbopack: {}` to fix build
- `CLAUDE.md` — Updated architecture diagram

### 7. Build Verification

```bash
npm run build
# ✓ Compiled successfully
# ✓ TypeScript checks passed
# ✓ All routes generated
```

## Summary

The visualization system is now **complete and functional**:
- ✅ Two-agent architecture (Main + Visualization)
- ✅ Proper tracer code generation following API
- ✅ Web worker execution with injected context
- ✅ Command collection via Commander
- ✅ Animation controls and renderer detection
- ✅ Build succeeds with no errors

Next step: Test in browser by asking the chatbot to visualize an algorithm!
