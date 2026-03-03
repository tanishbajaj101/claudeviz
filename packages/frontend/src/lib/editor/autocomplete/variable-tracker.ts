/**
 * Map of auto-inferred types based on common initialization patterns
 */
const AUTO_TYPE_INFERENCE: Record<string, RegExp> = {
  vector: /vector\s*<[^>]+>\s*\{/,
  map: /map\s*<[^>]+>\s*\{/,
  unordered_map: /unordered_map\s*<[^>]+>\s*\{/,
  set: /set\s*<[^>]+>\s*\{/,
  string: /string\s*\(/,
};

/**
 * Tracks variable declarations in C++ code
 * Returns a map of variable names to their container types
 */
export function trackVariables(code: string): Map<string, string> {
  const variables = new Map<string, string>();
  const lines = code.split('\n');

  lines.forEach((line) => {
    // Pattern 1: STL containers with explicit types
    // Support one level of nested brackets e.g. map<int, vector<int>> using <(?:[^<>]+|<[^<>]*>)+>
    const containerRegex = /\b(vector|map|unordered_map|set|unordered_set|stack|queue|priority_queue|deque|list)\s*<(?:[^<>]+|<[^<>]*>)+>\s+(\w+)/g;
    for (const match of line.matchAll(containerRegex)) {
      variables.set(match[2], match[1]);
    }

    // Pattern 2: string variables
    const stringRegex = /\bstring\s+(\w+)\s*[=;,\)]/g;
    for (const match of line.matchAll(stringRegex)) {
      variables.set(match[1], 'string');
    }

    // Pattern 3: Custom types (ListNode*, TreeNode*)
    const customTypeRegex = /\b(ListNode|TreeNode)\s*\*\s*(\w+)/g;
    for (const match of line.matchAll(customTypeRegex)) {
      variables.set(match[2], match[1]);
    }

    // Pattern 4: Auto type inference
    const autoRegex = /\bauto\s+(\w+)\s*=\s*(.+?)(?:;|$)/g;
    for (const autoMatch of line.matchAll(autoRegex)) {
      const [, varName, initialization] = autoMatch;

      // Try to infer type from initialization
      for (const [type, pattern] of Object.entries(AUTO_TYPE_INFERENCE)) {
        if (pattern.test(initialization)) {
          variables.set(varName, type);
          break;
        }
      }
    }
  });

  return variables;
}

/**
 * Debounced version of trackVariables for use in editor change handlers
 */
let debounceTimer: NodeJS.Timeout | null = null;

export function trackVariablesDebounced(
  code: string,
  callback: (variables: Map<string, string>) => void,
  delay: number = 300
): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    const variables = trackVariables(code);
    callback(variables);
  }, delay);
}

/**
 * Cancels any pending debounced tracking
 */
export function cancelTracking(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}
