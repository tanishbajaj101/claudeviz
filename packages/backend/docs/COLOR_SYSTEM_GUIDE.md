# Visualization Color System Guide

## Overview

The visualization system uses a **multi-color approach** inspired by the original algorithm-visualizer to make algorithm steps crystal clear. Colors can **combine** for richer visual meaning.

---

## Color Palette

| Color | State | Meaning | When to Use |
|-------|-------|---------|-------------|
| 🔵 **BLUE** | `selected` | "I'm looking at this RIGHT NOW" | Examining, comparing, current focus |
| 🩷 **PINK** | `patched` | "This value CHANGED" | Modified, swapped, written |
| 🟣 **PURPLE** | `selected + patched` | "Examining what I just changed" | Modified value still in focus |
| ⚫ **GRAY** | default | Inactive, not involved | Background elements |

### Original Algorithm-Visualizer Colors (Reference)
```scss
$color-selected: #2962ff;  // Bright blue
$color-patched: #c51162;   // Magenta/pink
$color-active: #00e676;    // Green (for success states)
$color-alert: #f3bd58;     // Yellow/orange (for warnings)
```

### Our Implementation (Tailwind)
```javascript
// BLUE - Examination/Focus
selected: 'bg-blue-600 border-blue-400 shadow-blue-500/50'

// PINK - Modification
patched: 'bg-pink-600 border-pink-400'

// PURPLE - Both (selected + patched)
both: 'bg-purple-600 border-purple-400 shadow-purple-500/50'

// GRAY - Default
default: 'bg-gray-800 border-gray-700'
```

---

## Understanding `select()` vs `patch()`

### `select()` - Examination (BLUE)
**Purpose:** Show what the algorithm is **currently looking at**

**Use Cases:**
- Comparing two elements: `tracer.select(i); tracer.select(j);`
- Showing pointer positions: `tracer.select(left); tracer.select(right);`
- Highlighting search window: `tracer.select(lo, hi);`
- Inspecting before decision: `tracer.select(mid);`

**Best Practice:**
- ✅ Clean up immediately: `tracer.deselect(i)` when moving focus
- ✅ Show **active** examination, not history
- ❌ Don't leave stale selections

**Example - Binary Search:**
```javascript
// Show current search window (BLUE)
tracer.select(lo, hi);
logger.println(`Searching in range ${lo} to ${hi}`);
Tracer.delay();

// Done with this window
tracer.deselect(lo, hi);
```

### `patch()` - Modification (PINK)
**Purpose:** Show what **values changed**

**Use Cases:**
- Array element was modified: `tracer.patch(i, newValue);`
- Swap occurred: `tracer.patch(i); tracer.patch(j);`
- Result written: `tracer.patch(outputIndex, result);`
- Value updated: `tracer.patch(dpRow, dpCol, value);`

**Best Practice:**
- ✅ Keep longer to show change **history**
- ✅ Shows **what happened**, not current focus
- ❌ Only `depatch()` when resetting for new visualization phase
- ✅ Can accumulate multiple patches to show all changes

**Example - Bubble Sort:**
```javascript
// Compare (BLUE)
tracer.select(i);
tracer.select(j);
logger.println(`Comparing arr[${i}] vs arr[${j}]`);
Tracer.delay();

// Swap (PINK, stays visible)
if (arr[i] > arr[j]) {
  tracer.patch(i, arr[j]);
  tracer.patch(j, arr[i]);
  logger.println('Swapped!');
  Tracer.delay();
}

// Move focus (remove BLUE, keep PINK)
tracer.deselect(i);
tracer.deselect(j);
// Pink patches remain to show swap history
```

---

## Color Combinations

### 1. **BLUE only** (Examining unchanged values)
```javascript
tracer.select(i);
logger.println(`Checking arr[${i}] = ${arr[i]}`);
Tracer.delay();
tracer.deselect(i);
```
**Result:** Element turns blue, then back to gray

### 2. **PINK only** (Changed but not currently focused)
```javascript
tracer.patch(i, newValue);
logger.println(`Updated arr[${i}] to ${newValue}`);
Tracer.delay();
// Don't deselect - keep pink to show it changed
```
**Result:** Element stays pink (shows modification history)

### 3. **PURPLE** (Examining + Modified = Both)
```javascript
tracer.select(i);
tracer.patch(i, newValue);  // Now PURPLE (blue + pink)
logger.println(`Updating arr[${i}] to ${newValue}`);
Tracer.delay();

tracer.deselect(i);  // Remove blue, now just PINK
```
**Result:** Purple while examining the change, then pink after

### 4. **Multiple BLUE** (Comparing multiple elements)
```javascript
// Show all elements being compared
for (let i = 0; i < k; i++) {
  tracer.select(i);
}
logger.println(`Examining first ${k} elements`);
Tracer.delay();

// Clean up all at once
for (let i = 0; i < k; i++) {
  tracer.deselect(i);
}
```
**Result:** Multiple blue elements simultaneously

### 5. **Multiple PINK** (Tracking all changes)
```javascript
// Partition in quicksort
for (let i = 0; i < arr.length; i++) {
  if (arr[i] < pivot) {
    tracer.patch(i);  // Mark all moved elements
  }
}
logger.println('All elements less than pivot are marked');
Tracer.delay();
```
**Result:** Multiple pink elements showing all modifications

---

## Common Patterns by Algorithm Type

### Binary Search
```javascript
// Window (BLUE range)
tracer.select(lo, hi);

// Mid inspection (PINK or PURPLE if window still selected)
tracer.patch(mid);

// Clean up window, keep mid visible
tracer.deselect(lo, hi);
```
**Colors:** BLUE search window → PURPLE mid check → PINK found element

### Two Pointers
```javascript
// Both pointers (BLUE)
tracer.select(left);
tracer.select(right);

// Move one pointer
tracer.deselect(right);
right++;
tracer.select(right);
```
**Colors:** Two BLUE dots moving toward each other

### Sorting (Bubble/Selection)
```javascript
// Compare (BLUE)
tracer.select(i);
tracer.select(j);

// Swap (add PINK, making PURPLE)
tracer.patch(i, arr[j]);
tracer.patch(j, arr[i]);

// Continue (remove BLUE, keep PINK)
tracer.deselect(i);
tracer.deselect(j);
```
**Colors:** BLUE comparison → PURPLE swap → PINK history

### Hash Map / Two Sum
```javascript
// Current element (BLUE)
tracer.select(i);

// Found complement (PINK)
tracer.patch(complementIndex);

// Both visible: BLUE current + PINK found = answer pair
```
**Colors:** BLUE current + PINK found = visual pair

### Dynamic Programming
```javascript
// Current cell being computed (BLUE)
tracer.select(row, col);

// Write result (add PINK = PURPLE)
tracer.patch(row, col, value);

// Move to next cell (remove BLUE, keep PINK)
tracer.deselect(row, col);
```
**Colors:** BLUE empty cell → PURPLE computing → PINK filled

---

## Detailed Examples

### Example 1: Binary Search with Rich Colors

**Description:** Binary search showing search window narrowing

```javascript
const tracer = new Array1DTracer('Binary Search');
const logger = new LogTracer('Steps');
Layout.setRoot(new VerticalLayout([tracer, logger]));

const arr = [2, 5, 8, 12, 16, 23, 38, 42, 56];
const target = 23;
tracer.set(arr);
Tracer.delay();

logger.println(`Searching for ${target}`);
logger.println('🔵 BLUE = search window, 🩷 PINK = examining');
Tracer.delay();

let lo = 0, hi = arr.length - 1;

while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);

  // Show search window (BLUE range)
  tracer.select(lo, hi);
  logger.println(`Search window: [${lo}, ${hi}]`);
  Tracer.delay();

  // Examine mid (PINK, but window still selected = PURPLE)
  tracer.patch(mid);
  logger.println(`Checking mid=${mid}, value=${arr[mid]}`);
  Tracer.delay();

  // Clean up selection, keep patch
  tracer.deselect(lo, hi);
  tracer.depatch(mid);

  if (arr[mid] === target) {
    logger.println(`✓ Found ${target} at index ${mid}!`);
    tracer.select(mid);  // Final BLUE highlight
    Tracer.delay();
    break;
  } else if (arr[mid] < target) {
    logger.println(`${arr[mid]} < ${target}, search right`);
    lo = mid + 1;
  } else {
    logger.println(`${arr[mid]} > ${target}, search left`);
    hi = mid - 1;
  }

  Tracer.delay();
}
```

**Color Flow:**
1. Frame 1: BLUE range [0-8]
2. Frame 2: PURPLE mid (4) - examining in blue window
3. Frame 3: GRAY window, continuing search
4. Frame 4: BLUE range [5-8]
5. Frame 5: PURPLE mid (6) - found! (PURPLE = blue window + pink found)
6. Frame 6: BLUE final highlight on answer

### Example 2: Bubble Sort Showing All Swaps

```javascript
const tracer = new Array1DTracer('Bubble Sort');
const logger = new LogTracer('Steps');
Layout.setRoot(new VerticalLayout([tracer, logger]));

const arr = [5, 2, 8, 1, 9];
tracer.set(arr);
Tracer.delay();

logger.println('🔵 BLUE = comparing, 🩷 PINK = swapped');
Tracer.delay();

for (let i = 0; i < arr.length; i++) {
  logger.println(`Pass ${i + 1}`);
  Tracer.delay();

  for (let j = 0; j < arr.length - i - 1; j++) {
    // Compare (BLUE both)
    tracer.select(j);
    tracer.select(j + 1);
    logger.println(`Comparing arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}`);
    Tracer.delay();

    if (arr[j] > arr[j + 1]) {
      // Swap (add PINK = PURPLE while selected)
      const temp = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = temp;

      tracer.patch(j, arr[j]);
      tracer.patch(j + 1, arr[j + 1]);
      logger.println('Swapped! 🩷');
      Tracer.delay();
    } else {
      logger.println('No swap needed');
      Tracer.delay();
    }

    // Remove blue selection, keep pink history
    tracer.deselect(j);
    tracer.deselect(j + 1);
    Tracer.delay();
  }

  // Mark sorted element
  logger.println(`✓ Position ${arr.length - i - 1} sorted`);
  Tracer.delay();
}

logger.println('✓ Array sorted!');
```

**Color Flow:**
- BLUE comparison → PURPLE during swap → PINK after swap
- Accumulates PINK marks showing all positions that were modified

---

## Anti-Patterns (What NOT to Do)

### ❌ **Leaving Stale Selections**
```javascript
// BAD
tracer.select(i);
logger.println('Checking i');
Tracer.delay();
// Forgot to deselect!
tracer.select(j);  // Now both i and j are blue (confusing)
```

**Fix:**
```javascript
// GOOD
tracer.select(i);
logger.println('Checking i');
Tracer.delay();
tracer.deselect(i);  // Clean up before moving

tracer.select(j);
logger.println('Checking j');
Tracer.delay();
```

### ❌ **Depatching Too Early**
```javascript
// BAD
tracer.patch(i, newValue);
logger.println('Updated i');
Tracer.delay();
tracer.depatch(i);  // Immediately removed - user can't see the change!
```

**Fix:**
```javascript
// GOOD
tracer.patch(i, newValue);
logger.println('Updated i');
Tracer.delay();
// Keep patch visible to show change history
// Only depatch when resetting visualization
```

### ❌ **Not Using Colors**
```javascript
// BAD - no visual feedback
for (let i = 0; i < arr.length; i++) {
  logger.println(`Checking ${arr[i]}`);
  Tracer.delay();
}
```

**Fix:**
```javascript
// GOOD - visual highlight follows the loop
for (let i = 0; i < arr.length; i++) {
  tracer.select(i);
  logger.println(`Checking arr[${i}] = ${arr[i]}`);
  Tracer.delay();
  tracer.deselect(i);
}
```

---

## Summary

| Action | Color | Keep Until | Use For |
|--------|-------|-----------|---------|
| `select(i)` | 🔵 BLUE | Immediately after use | Current focus/examination |
| `patch(i)` | 🩷 PINK | Keep for history | Show modifications |
| `select(i) + patch(i)` | 🟣 PURPLE | `deselect()` → pink | Examining while modifying |
| `deselect(i)` | Remove blue | - | Move focus away |
| `depatch(i)` | Remove pink | - | Reset visualization |

**Golden Rule:**
- **SELECT** = temporary focus (clean up fast)
- **PATCH** = permanent change (keep visible)
- **BOTH** = examining a change (purple)

Use multiple colors to tell a visual story! 🎨
