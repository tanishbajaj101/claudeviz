import type * as Monaco from 'monaco-editor';
import { findReadOnlyRegions, isLineReadOnly } from '@/lib/editor/readonly-region';

/** Check if the cursor's current line is in a read-only region. */
function isCursorInReadOnly(ed: Monaco.editor.ICodeEditor): boolean {
  const sel = ed.getSelection();
  const model = ed.getModel();
  if (!sel || !model) return false;
  const regions = findReadOnlyRegions(model.getValue());
  return isLineReadOnly(sel.startLineNumber, regions);
}

/**
 * Registers keyboard shortcuts for the Monaco editor
 */
export function registerKeyboardShortcuts(
  monaco: typeof Monaco,
  editor: Monaco.editor.IStandaloneCodeEditor,
  onSave?: () => void
): void {
  // Ctrl+/ - Toggle line comment (built-in action)
  editor.addAction({
    id: 'toggle-comment',
    label: 'Toggle Line Comment',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash],
    run: (ed) => {
      if (isCursorInReadOnly(ed)) return;
      ed.trigger('keyboard', 'editor.action.commentLine', null);
    },
  });

  // Ctrl+D - Duplicate current line
  editor.addAction({
    id: 'duplicate-line',
    label: 'Duplicate Line',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD],
    run: (ed) => {
      const selection = ed.getSelection();
      if (!selection) return;

      const model = ed.getModel();
      if (!model) return;

      const lineNumber = selection.startLineNumber;
      const regions = findReadOnlyRegions(model.getValue());
      if (isLineReadOnly(lineNumber, regions)) return;

      const lineContent = model.getLineContent(lineNumber);
      const lineEndColumn = model.getLineMaxColumn(lineNumber);

      // Insert the duplicated line below
      ed.executeEdits('duplicate-line', [
        {
          range: new monaco.Range(lineNumber, lineEndColumn, lineNumber, lineEndColumn),
          text: '\n' + lineContent,
        },
      ]);

      // Move cursor to the duplicated line
      ed.setPosition({
        lineNumber: lineNumber + 1,
        column: selection.startColumn,
      });
    },
  });

  // Ctrl+Shift+F - Format document (built-in action)
  editor.addAction({
    id: 'format-document',
    label: 'Format Document',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
    run: (ed) => {
      ed.trigger('keyboard', 'editor.action.formatDocument', null);
    },
  });

  // Ctrl+S - Save/Submit (custom callback)
  if (onSave) {
    editor.addAction({
      id: 'save-submit',
      label: 'Save / Submit Code',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        onSave();
      },
    });
  }

  // Additional useful shortcuts

  // Ctrl+Shift+K - Delete line (built-in)
  editor.addAction({
    id: 'delete-line',
    label: 'Delete Line',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyK],
    run: (ed) => {
      if (isCursorInReadOnly(ed)) return;
      ed.trigger('keyboard', 'editor.action.deleteLines', null);
    },
  });

  // Alt+Up/Down - Move line up/down (built-in)
  editor.addAction({
    id: 'move-line-up',
    label: 'Move Line Up',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.UpArrow],
    run: (ed) => {
      const sel = ed.getSelection();
      const model = ed.getModel();
      if (!sel || !model) return;
      const regions = findReadOnlyRegions(model.getValue());
      // Block if current line is read-only or if moving up into the header region
      if (isLineReadOnly(sel.startLineNumber, regions)) return;
      if (regions.headerEndLine !== null && sel.startLineNumber === regions.headerEndLine + 1) return;
      ed.trigger('keyboard', 'editor.action.moveLinesUpAction', null);
    },
  });

  editor.addAction({
    id: 'move-line-down',
    label: 'Move Line Down',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.DownArrow],
    run: (ed) => {
      const sel = ed.getSelection();
      const model = ed.getModel();
      if (!sel || !model) return;
      const regions = findReadOnlyRegions(model.getValue());
      // Block if current line is read-only or if moving down into the main region
      if (isLineReadOnly(sel.startLineNumber, regions)) return;
      if (regions.mainStartLine !== null && sel.endLineNumber + 1 >= regions.mainStartLine) return;
      ed.trigger('keyboard', 'editor.action.moveLinesDownAction', null);
    },
  });
}
