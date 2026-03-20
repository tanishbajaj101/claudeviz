# Future: Gamified Problems Page — Shattered Crystal Map

## Concept

The `/problems` page becomes a **Shattered Crystal Map** — a dark artifact made of category shards arranged like broken glass. Unsolved shards are dark and cracked. As problems are solved, each shard fills with crystalline light from within. Completing all problems in a category forges the shard fully.

---

## The Map Layout

The page background is `#08080f`. In the center sits a shattered crystal artifact — all category shards arranged together like pieces of a broken gemstone. Shards share jagged edges with neighbors and visually interlock.

Each shard is an **irregular polygon** (SVG `clipPath`), not a rectangle. Categories:

```
Array, DP, String, Graph, Binary Tree, Linked List,
Heap, Backtracking, Stack, Greedy, Trie, Binary Search,
Advanced Graph, Math, Bit Manipulation
```

---

## Shard Fill States

Three visual states based on % solved:

- **Dark (0%)** — dim outline, cracked glass texture, barely visible
- **Partial (1–99%)** — fill gradient rises from bottom, glow scales with fill %
- **Complete (100%)** — fully crystallized, gentle pulse, particle sparkles float off edges

The fill **rises from bottom** — a glowing gradient that climbs as problems are solved. Unsolved portion looks like dark cracked glass.

---

## Per-Shard Anatomy (SVG structure)

```
┌─── clip-path polygon (irregular, unique per category) ────────┐
│                                                                │
│   [dark cracked texture layer]        ← always visible        │
│   [fill gradient rect, height=N%]     ← animates up on solve  │
│   [shimmer/glint overlay]             ← moves on hover        │
│   [icon + title + count text]         ← always on top         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

- **Fill gradient:** bottom = deep category color → top = bright white-ish crystal highlight
- **Glow:** `filter: drop-shadow(0 0 12px <category-color>)` — intensity scales with fill %
- **Complete state:** shard pulses gently, small particle sparkles float off edges

---

## Color Palette (crystalline tints per category)

| Category       | Color     | Hex       |
|----------------|-----------|-----------|
| Array          | Sapphire  | `#3b82f6` |
| DP             | Amethyst  | `#8b5cf6` |
| String         | Emerald   | `#10b981` |
| Graph          | Amber     | `#f59e0b` |
| Binary Tree    | Jade      | `#22c55e` |
| Linked List    | Cyan      | `#06b6d4` |
| Heap           | Rose      | `#f43f5e` |
| Backtracking   | Indigo    | `#6366f1` |
| Stack          | Orange    | `#ea580c` |

---

## Interactions

| Action | Effect |
|--------|--------|
| Hover shard | Shard lifts `translateY(-4px)` + shimmer glint sweeps across |
| Click shard | Shard "shatters" into dungeon room (scale + fade transition) |
| Solve a problem | Return to map → shard fill ticks up with a flash |
| Complete category | Shard fully crystallizes — bright burst + `SHARD FORGED` banner |
| All complete | Full artifact assembles with a grand glow animation |

---

## Dungeon Room (problem list inside a category)

Clicking a shard transitions into the **dungeon room** — a full-screen panel showing that category's problems:

- **Boss problem** pinned at top (hardest unsolved problem in category) with special card
- Problems grouped as **Common / Rare / Legendary** (replaces Easy/Medium/Hard)
- XP reward shown per problem: Easy=+100 XP, Medium=+200 XP, Hard=+300 XP
- Solved = `DEFEATED` in muted green with left border accent
- Unsolved = `AVAILABLE` with pulsing `→` arrow

---

## XP / Level System

```
LVL 7  ██████░░░░  1,840 / 3,200 XP
```

- Displayed in header bar across the app
- Easy = +100 XP, Medium = +200 XP, Hard = +300 XP
- Level up triggers: screen flash + `⚡ LEVEL UP → 8` toast
- Purely cosmetic/motivational — no gating on content

---

## Implementation Plan

### Files to create
1. **`DungeonMapPage.tsx`** — dark full-screen layout, renders SVG shard grid, replaces `ProblemsPage`
2. **`CrystalShard.tsx`** — single shard component: SVG `clipPath` polygon + animated fill rect + glow filter + hover lift
3. **`shardShapes.ts`** — hardcoded polygon point coordinates for each category (unique irregular shapes that visually interlock)
4. **`DungeonRoomPage.tsx`** (or panel) — problem list with boss pinned, XP shown, Common/Rare/Legendary grouping
5. **`useXP.ts`** — derives level, total XP, and fill % per category from `solvedProblems`

### Files to modify
- **`router.tsx`** — point `/problems` to `DungeonMapPage`
- **`ProblemsPage.tsx`** — keep as fallback or repurpose as flat "All Problems" view

### Dependencies
- **Framer Motion** — fill animation, hover lift, page transitions, particle effects
- No backend changes needed — all derived from existing `solvedProblems` + problem data

### Hardest part
Defining the polygon coordinates in `shardShapes.ts` so shards visually interlock. Everything else is CSS + SVG animation.

---

## Notes

- 105 total problems: 28 Easy, 64 Medium, 13 Hard
- 15 categories: Array(18), DP(14), String(12), Graph(11), Binary Tree(10), Linked List(8), Heap(6), Backtracking(6), Stack(5), Greedy(4), Trie(3), Binary Search(3), Advanced Graph(3), Math(1), Bit Manipulation(1)
- Math(1) and Bit Manipulation(1) are tiny — consider merging into a single "Misc" shard or making them small accent shards
