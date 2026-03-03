import type * as Monaco from 'monaco-editor';
import { trackVariables } from './variable-tracker';
import { STL_DEFINITIONS } from './stl-definitions';

/**
 * Registers the C++ STL autocomplete provider with Monaco editor
 */
export function registerCompletionProvider(monaco: typeof Monaco): Monaco.IDisposable {
  // Store current variables map (updated when code changes)
  let currentVariables = new Map<string, string>();

  // Register the completion provider
  return monaco.languages.registerCompletionItemProvider('cpp', {
    triggerCharacters: ['.', '>'],

    provideCompletionItems: (model, position) => {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      // Update variable tracking on each completion request
      const fullCode = model.getValue();
      currentVariables = trackVariables(fullCode);

      // Check if we're after a '.' or '->'
      const dotMatch = textUntilPosition.match(/(\w+)\.$/);
      const arrowMatch = textUntilPosition.match(/(\w+)->$/);

      let variableName: string | null = null;
      if (dotMatch) {
        variableName = dotMatch[1];
      } else if (arrowMatch) {
        variableName = arrowMatch[1];
      }

      if (!variableName) {
        return { suggestions: [] };
      }

      // Look up the variable type
      const variableType = currentVariables.get(variableName);
      if (!variableType) {
        return { suggestions: [] };
      }

      // Get method definitions for this type
      const methods = STL_DEFINITIONS[variableType];
      if (!methods) {
        return { suggestions: [] };
      }

      // Convert to Monaco completion items
      const suggestions: Monaco.languages.CompletionItem[] = methods.map((method) => ({
        label: method.label,
        kind: method.kind === 'Method'
          ? monaco.languages.CompletionItemKind.Method
          : monaco.languages.CompletionItemKind.Field,
        insertText: method.snippet,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: {
          value: `**${method.signature}**\n\n${method.documentation}`,
        },
        detail: method.signature,
      }));

      return { suggestions };
    },
  });
}

/**
 * Updates the variable tracking for autocomplete
 * Call this when the editor content changes
 */
export function updateVariableTracking(code: string): Map<string, string> {
  return trackVariables(code);
}
