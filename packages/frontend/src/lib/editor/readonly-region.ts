export interface ReadOnlyRegions {
  /** Last line of the #include/using block (read-only: lines 1..headerEndLine). null if not detected. */
  headerEndLine: number | null;
  /** First line of int main() (read-only: lines mainStartLine..EOF). null if not detected. */
  mainStartLine: number | null;
}

const HEADER_LINE = /^\s*(#include\b|using\s+namespace\b)/;
const MAIN_LINE = /^\s*int\s+main\s*\(/;

/**
 * Detect the two read-only regions in a C++ starter-code string.
 * Lines are 1-based (matching Monaco convention).
 */
export function findReadOnlyRegions(code: string): ReadOnlyRegions {
  const lines = code.split('\n');

  // --- Header detection ---
  // Walk from top: include every #include / using namespace line (and blank lines between them).
  let headerEndLine: number | null = null;
  let lastHeaderContentLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (HEADER_LINE.test(trimmed)) {
      lastHeaderContentLine = i + 1; // 1-based
      headerEndLine = i + 1;
    } else if (trimmed === '' && lastHeaderContentLine > 0) {
      // blank line within header block — extend
      headerEndLine = i + 1;
    } else if (lastHeaderContentLine > 0) {
      // first non-header, non-blank line — stop
      break;
    }
  }

  // --- Main detection ---
  let mainStartLine: number | null = null;
  for (let i = 0; i < lines.length; i++) {
    if (MAIN_LINE.test(lines[i])) {
      mainStartLine = i + 1; // 1-based
      break;
    }
  }

  return { headerEndLine, mainStartLine };
}

/** Check whether a 1-based line number falls inside a read-only region. */
export function isLineReadOnly(line: number, regions: ReadOnlyRegions): boolean {
  if (regions.headerEndLine !== null && line <= regions.headerEndLine) return true;
  if (regions.mainStartLine !== null && line >= regions.mainStartLine) return true;
  return false;
}
