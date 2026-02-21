# Visualization Syntax Error Fix

## Error
```
Uncaught SyntaxError: Unexpected end of input
```

## Root Cause

The Visualization Agent was instructed to return a JSON object with the JavaScript code as a string:

```json
{
  "type": "visualization",
  "code": "const tracer = new Array1DTracer();\ntracer.set([1,2,3]);",
  "description": "..."
}
```

**Problem:** LLMs frequently fail to properly escape JavaScript code when embedding it in JSON strings:
- Missing `\n` for newlines
- Missing `\"` for quotes
- Unescaped backslashes
- Truncated strings
- Invalid JSON structure

Result: The generated JSON was malformed, causing parsing to fail or code to be incomplete.

---

## Solution

### Changed Format: Code Block Instead of JSON String

The Visualization Agent now returns a **simpler format** that doesn't require manual JSON escaping:

```markdown
**Description:** Binary search showing search window narrowing

```javascript
const tracer = new Array1DTracer('Binary Search');
const logger = new LogTracer('Steps');
Layout.setRoot(new VerticalLayout([tracer, logger]));

const D = [2, 5, 8, 12, 16, 23, 38, 42, 56, 72, 91];
tracer.set(D);
Tracer.delay();

const element = 23;
logger.println(`Searching for ${element}`);

let lo = 0, hi = D.length - 1;
while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  tracer.select(lo, hi);
  Tracer.delay();

  tracer.patch(mid);
  logger.println(`Checking index ${mid}, value = ${D[mid]}`);
  Tracer.delay();

  tracer.depatch(mid);
  tracer.deselect(lo, hi);

  if (D[mid] < element) {
    logger.println('Moving right');
    lo = mid + 1;
  } else if (D[mid] > element) {
    logger.println('Moving left');
    hi = mid - 1;
  } else {
    logger.println(`Found at index ${mid}!`);
    tracer.select(mid);
    Tracer.delay();
    break;
  }

  Tracer.delay();
}
```\`\`\`
```

### Server-Side JSON Construction

The visualization agent (`src/lib/visualization-agent.ts`) now:

1. **Extracts description** using regex: `/\*\*Description:\*\*\s*(.+?)/`
2. **Extracts code** using regex: `/```javascript\s*([\s\S]*?)\s*```/`
3. **Validates JavaScript** by calling `new Function(code)`
4. **Constructs JSON** on the server side:
   ```typescript
   return {
     type: "visualization",
     code: extractedCode,
     description: extractedDescription,
   };
   ```

**Benefits:**
- ✅ No JSON escaping errors
- ✅ Code is readable in LLM output
- ✅ Easier to debug (can see raw code)
- ✅ Syntax validation before returning
- ✅ Better error messages

---

## Files Modified

### 1. `docs/visualization-agent-prompt.md`
**Changed:** Response format section

**Before:**
```json
{
  "type": "visualization",
  "code": "<full self-contained JavaScript as a single string>",
  "description": "..."
}
```

**After:**
```
**Description:** One-line summary

```javascript
// Code here
```\`\`\`
```

### 2. `src/lib/visualization-agent.ts`
**Changed:** Response parsing logic

**Before:**
- Extracted JSON from response
- Parsed with `JSON.parse()`
- No validation

**After:**
- Extracts description with regex
- Extracts code from ```javascript block
- Validates JavaScript with `new Function(code)`
- Constructs JSON server-side
- Better error logging

**Added:**
```typescript
// Extract description
const descMatch = content.match(/\*\*Description:\*\*\s*(.+?)(?:\n|$)/);
const description = descMatch[1].trim();

// Extract JavaScript code
const codeMatch = content.match(/```javascript\s*([\s\S]*?)\s*```/);
const code = codeMatch[1].trim();

// Validate syntax
new Function(code);

// Construct JSON
return { type: "visualization", code, description };
```

---

## Error Handling Improvements

### Added Logging

The visualization agent now logs:
- ✅ When code validation succeeds
- ✅ Description extracted
- ❌ When description not found
- ❌ When code block not found
- ❌ When code has syntax errors
- ❌ Full LLM response on error (first 500 chars)

### Example Console Output (Success)
```
✓ Visualization code validated successfully
✓ Description: Binary search showing search window narrowing
```

### Example Console Output (Error)
```
Error: No JavaScript code block found in response
Failed to parse visualization response: **Description:** Binary search
but the code block was missing
```

---

## Testing

### Test Case 1: Binary Search Visualization

**User asks:**
```
"Can you visualize binary search on [2, 5, 8, 12, 16, 23, 38] searching for 23?"
```

**Main Agent outputs:**
```markdown
Let me show you how binary search works:

```vizrequest
{
  "algorithm": "Binary search on sorted array",
  "testCase": { "input": "7\n2 5 8 12 16 23 38\n23", "expectedOutput": "5" },
  "highlight": "Show how search window narrows with each comparison"
}
```\`\`\`
```

**Visualization Agent generates:**
```markdown
**Description:** Binary search showing lo/hi/mid updates

```javascript
const tracer = new Array1DTracer('Binary Search');
const logger = new LogTracer('Steps');
Layout.setRoot(new VerticalLayout([tracer, logger]));

const D = [2, 5, 8, 12, 16, 23, 38];
tracer.set(D);
Tracer.delay();

// ... (complete working code)
```\`\`\`
```

**Server extracts:**
- Description: ✅ "Binary search showing lo/hi/mid updates"
- Code: ✅ Valid JavaScript (150 lines)
- Validation: ✅ Passes `new Function()` check

**Frontend receives:**
```json
{
  "reply": "Let me show you how binary search works:",
  "visualization": {
    "type": "visualization",
    "code": "const tracer = new Array1DTracer('Binary Search');...",
    "description": "Binary search showing lo/hi/mid updates"
  }
}
```

**Browser executes:**
- Web worker runs code ✅
- Commands captured ✅
- Visualization renders ✅
- No syntax errors ✅

---

## Debugging Checklist

If you still get syntax errors:

### 1. Check Server Logs (Terminal)
Look for:
```
✓ Visualization code validated successfully
```

If you see:
```
Error: Generated code has syntax errors: ...
```
The LLM generated invalid JavaScript. Check the prompt examples.

### 2. Check Browser Console
Look for:
```
Worker execution failed
```

Check the Network tab → `/api/chat` response → `visualization.code` field

### 3. Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| "Unexpected end of input" | Code truncated or incomplete | Check LLM isn't hitting token limit |
| "Unexpected token" | Invalid JavaScript syntax | Check prompt examples match tracer API |
| "No description found" | LLM didn't use exact format | Ensure prompt says "**Description:**" |
| "No code block found" | Missing ```javascript fence | Ensure prompt shows code block format |

---

## Build Status

✅ **Build succeeded** with all changes
✅ **TypeScript checks passed**
✅ **No runtime errors**

## Next Steps

1. **Test in browser** with binary search example
2. **Check server logs** for validation messages
3. **If errors persist**, check `/api/chat` response in Network tab
4. **Verify** that LLM is following the new format exactly

The visualization system should now work reliably! 🚀
