import type * as Monaco from 'monaco-editor';
import { runAllLintingRules } from './linting-rules';
import type { LintError } from '@/types/editor';

const LINTER_OWNER = 'cpp-linter';

let debounceTimer: NodeJS.Timeout | null = null;

/**
 * Registers linting for the Monaco editor
 * Returns a cleanup function to dispose the linting
 */
export function registerLinting(
  monaco: typeof Monaco,
  editor: Monaco.editor.IStandaloneCodeEditor,
  debounceDelay: number = 500
): () => void {
  const model = editor.getModel();
  if (!model) {
    return () => {};
  }

  // Function to run linting and update markers
  const runLinting = () => {
    const code = model.getValue();
    const errors = runAllLintingRules(code);
    const markers = convertToMarkers(errors);
    monaco.editor.setModelMarkers(model, LINTER_OWNER, markers);
  };

  // Debounced linting function
  const debouncedLinting = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      runLinting();
    }, debounceDelay);
  };

  // Listen to content changes
  const disposable = model.onDidChangeContent(() => {
    debouncedLinting();
  });

  // Run initial linting
  runLinting();

  // Return cleanup function
  return () => {
    disposable.dispose();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    // Clear all markers for this owner
    monaco.editor.removeAllMarkers(LINTER_OWNER);
  };
}

/**
 * Converts LintError objects to Monaco editor markers
 */
function convertToMarkers(errors: LintError[]): Monaco.editor.IMarkerData[] {
  return errors.map((error) => ({
    severity: getSeverity(error.severity),
    startLineNumber: error.line,
    startColumn: error.column,
    endLineNumber: error.line,
    endColumn: error.endColumn,
    message: error.message,
  }));
}

/**
 * Maps severity strings to Monaco severity enum values
 */
function getSeverity(severity: LintError['severity']): 8 | 4 | 2 | 1 {
  // Monaco.MarkerSeverity enum values:
  // Error = 8, Warning = 4, Info = 2, Hint = 1
  switch (severity) {
    case 'error':
      return 8; // MarkerSeverity.Error
    case 'warning':
      return 4; // MarkerSeverity.Warning
    case 'info':
      return 2; // MarkerSeverity.Info
    default:
      return 2; // Default to Info
  }
}

/**
 * Manually clears all linting markers
 */
export function clearLintingMarkers(monaco: typeof Monaco, model: Monaco.editor.ITextModel): void {
  monaco.editor.setModelMarkers(model, LINTER_OWNER, []);
}
