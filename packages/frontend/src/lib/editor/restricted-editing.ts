import type * as Monaco from 'monaco-editor';
import { findReadOnlyRegions } from './readonly-region';

/**
 * Sets up restricted (read-only) editing for the header and main() boilerplate
 * regions of C++ starter code. Returns a disposable to tear everything down.
 */
export function setupRestrictedEditing(
  monaco: typeof Monaco,
  editor: Monaco.editor.IStandaloneCodeEditor
): Monaco.IDisposable {
  const model = editor.getModel();
  if (!model) return { dispose() {} };

  let regions = findReadOnlyRegions(model.getValue());
  let lastValidValue = model.getValue();
  let decorationIds: string[] = [];
  let isReverting = false;

  function applyDecorations() {
    const totalLines = model!.getLineCount();
    const newDecorations: Monaco.editor.IModelDeltaDecoration[] = [];

    if (regions.headerEndLine !== null) {
      newDecorations.push({
        range: new monaco.Range(1, 1, regions.headerEndLine, model!.getLineMaxColumn(regions.headerEndLine)),
        options: {
          isWholeLine: true,
          className: 'editor-readonly-line',
          hoverMessage: { value: '**Read-only** — header boilerplate' },
        },
      });
      // Separator below header
      newDecorations.push({
        range: new monaco.Range(regions.headerEndLine, 1, regions.headerEndLine, 1),
        options: {
          isWholeLine: true,
          className: 'editor-readonly-separator-bottom',
        },
      });
    }

    if (regions.mainStartLine !== null && regions.mainStartLine <= totalLines) {
      newDecorations.push({
        range: new monaco.Range(regions.mainStartLine, 1, totalLines, model!.getLineMaxColumn(totalLines)),
        options: {
          isWholeLine: true,
          className: 'editor-readonly-line',
          hoverMessage: { value: '**Read-only** — I/O boilerplate' },
        },
      });
      // Separator above main
      newDecorations.push({
        range: new monaco.Range(regions.mainStartLine, 1, regions.mainStartLine, 1),
        options: {
          isWholeLine: true,
          className: 'editor-readonly-separator-top',
        },
      });
    }

    decorationIds = editor.deltaDecorations(decorationIds, newDecorations);
  }

  function changesOverlapReadOnly(changes: readonly Monaco.editor.IModelContentChange[]): boolean {
    for (const change of changes) {
      const startLine = change.range.startLineNumber;
      const endLine = change.range.endLineNumber;

      if (regions.headerEndLine !== null && startLine <= regions.headerEndLine) return true;
      if (regions.mainStartLine !== null && endLine >= regions.mainStartLine) return true;
    }
    return false;
  }

  // Apply initial decorations
  applyDecorations();

  // Intercept edits that touch read-only regions
  const contentListener = model.onDidChangeContent((e) => {
    if (isReverting) return;

    if (changesOverlapReadOnly(e.changes)) {
      isReverting = true;
      editor.trigger('readonly-guard', 'undo', null);
      isReverting = false;
    } else {
      // Edit was valid — update state
      lastValidValue = model!.getValue();
      regions = findReadOnlyRegions(lastValidValue);
      applyDecorations();
    }
  });

  // Show a read-only cursor style when hovering over protected zones
  const cursorListener = editor.onDidChangeCursorPosition((e) => {
    const line = e.position.lineNumber;
    const inReadOnly =
      (regions.headerEndLine !== null && line <= regions.headerEndLine) ||
      (regions.mainStartLine !== null && line >= regions.mainStartLine);

    editor.updateOptions({ readOnlyMessage: inReadOnly ? { value: 'This region is read-only' } : undefined });
  });

  return {
    dispose() {
      contentListener.dispose();
      cursorListener.dispose();
      editor.deltaDecorations(decorationIds, []);
    },
  };
}
