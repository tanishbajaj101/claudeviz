import type { LintError } from '@/types/editor';

/**
 * Checks for missing semicolons at the end of statements
 */
export function checkMissingSemicolons(code: string): LintError[] {
  const errors: LintError[] = [];
  const lines = code.split('\n');

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Skip empty lines, comments, and lines that don't need semicolons
    if (
      !trimmed ||
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('#') ||
      trimmed.endsWith('{') ||
      trimmed.endsWith('}') ||
      trimmed.endsWith(':') ||
      trimmed.endsWith(';') ||
      trimmed.endsWith(',') ||
      /^(if|else|for|while|do|switch|case|default|class|struct|namespace|public|private|protected)\b/.test(trimmed)
    ) {
      return;
    }

    // Check for statements that should end with semicolon
    if (/^(int|long|double|float|char|bool|string|vector|map|set|stack|queue|auto|const|return|break|continue)\b/.test(trimmed)) {
      errors.push({
        line: index + 1,
        column: line.length,
        endColumn: line.length + 1,
        message: 'Missing semicolon',
        severity: 'error',
      });
    }
  });

  return errors;
}

/**
 * Checks for mismatched brackets, braces, and parentheses
 */
export function checkBracketMismatch(code: string): LintError[] {
  const errors: LintError[] = [];
  const stack: Array<{ char: string; line: number; column: number }> = [];
  const lines = code.split('\n');

  const pairs: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
  };

  const opening = new Set(['(', '[', '{']);
  const closing = new Set([')', ']', '}']);

  lines.forEach((line, lineIndex) => {
    // Skip string literals and comments (simple approach)
    let inString = false;
    let inComment = false;

    for (let col = 0; col < line.length; col++) {
      const char = line[col];
      const prevChar = col > 0 ? line[col - 1] : '';

      // Handle strings
      if (char === '"' && prevChar !== '\\') {
        inString = !inString;
        continue;
      }

      // Handle comments
      if (!inString && char === '/' && line[col + 1] === '/') {
        inComment = true;
        break;
      }

      if (inString || inComment) continue;

      // Check brackets
      if (opening.has(char)) {
        stack.push({ char, line: lineIndex + 1, column: col + 1 });
      } else if (closing.has(char)) {
        if (stack.length === 0) {
          errors.push({
            line: lineIndex + 1,
            column: col + 1,
            endColumn: col + 2,
            message: `Unexpected closing bracket '${char}'`,
            severity: 'error',
          });
        } else {
          const last = stack[stack.length - 1];
          const expected = pairs[last.char];
          if (expected === char) {
            stack.pop();
          } else {
            errors.push({
              line: lineIndex + 1,
              column: col + 1,
              endColumn: col + 2,
              message: `Mismatched bracket: expected '${expected}' but found '${char}'`,
              severity: 'error',
            });
          }
        }
      }
    }
  });

  // Check for unclosed brackets
  stack.forEach((item) => {
    errors.push({
      line: item.line,
      column: item.column,
      endColumn: item.column + 1,
      message: `Unclosed bracket '${item.char}'`,
      severity: 'error',
    });
  });

  return errors;
}

/**
 * Checks for common mistakes like using = instead of == in conditions
 */
export function checkCommonMistakes(code: string): LintError[] {
  const errors: LintError[] = [];
  const lines = code.split('\n');

  lines.forEach((line, index) => {
    // Check for = instead of == in if/while conditions
    const assignmentInCondition = line.match(/\b(if|while)\s*\([^)]*\b(\w+)\s*=\s*([^=])/);
    if (assignmentInCondition) {
      const col = line.indexOf('=', line.indexOf(assignmentInCondition[1]));
      errors.push({
        line: index + 1,
        column: col + 1,
        endColumn: col + 2,
        message: 'Did you mean == instead of =?',
        severity: 'warning',
      });
    }
  });

  return errors;
}

/**
 * Checks for missing common include directives
 */
export function checkMissingIncludes(code: string): LintError[] {
  const errors: LintError[] = [];
  const lines = code.split('\n');

  // Check if using STL containers without includes
  const usesVector = /\bvector\s*</.test(code);
  const usesMap = /\b(map|unordered_map)\s*</.test(code);
  const usesSet = /\b(set|unordered_set)\s*</.test(code);
  const usesStack = /\bstack\s*</.test(code);
  const usesQueue = /\b(queue|priority_queue)\s*</.test(code);
  const usesString = /\bstring\s+\w+/.test(code);

  const hasVectorInclude = /#include\s*<vector>/.test(code);
  const hasMapInclude = /#include\s*<map>/.test(code);
  const hasUnorderedMapInclude = /#include\s*<unordered_map>/.test(code);
  const hasSetInclude = /#include\s*<set>/.test(code);
  const hasUnorderedSetInclude = /#include\s*<unordered_set>/.test(code);
  const hasStackInclude = /#include\s*<stack>/.test(code);
  const hasQueueInclude = /#include\s*<queue>/.test(code);
  const hasStringInclude = /#include\s*<string>/.test(code);

  const warnings: string[] = [];

  if (usesVector && !hasVectorInclude) warnings.push('#include <vector>');
  if (usesMap && !hasMapInclude && !hasUnorderedMapInclude) warnings.push('#include <map> or <unordered_map>');
  if (usesSet && !hasSetInclude && !hasUnorderedSetInclude) warnings.push('#include <set> or <unordered_set>');
  if (usesStack && !hasStackInclude) warnings.push('#include <stack>');
  if (usesQueue && !hasQueueInclude) warnings.push('#include <queue>');
  if (usesString && !hasStringInclude) warnings.push('#include <string>');

  if (warnings.length > 0) {
    errors.push({
      line: 1,
      column: 1,
      endColumn: 1,
      message: `Missing includes: ${warnings.join(', ')}`,
      severity: 'warning',
    });
  }

  return errors;
}

/**
 * Runs all linting rules on the provided code
 */
export function runAllLintingRules(code: string): LintError[] {
  const errors: LintError[] = [];

  // Run all linting rules
  errors.push(...checkMissingSemicolons(code));
  errors.push(...checkBracketMismatch(code));
  errors.push(...checkCommonMistakes(code));
  errors.push(...checkMissingIncludes(code));

  return errors;
}
