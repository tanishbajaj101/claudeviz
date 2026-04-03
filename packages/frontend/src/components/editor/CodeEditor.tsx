import { useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Editor, { OnMount } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';
import { registerCompletionProvider } from '@/lib/editor/autocomplete/completion-provider';
import { registerLinting } from '@/lib/editor/linting/diagnostic-provider';
import { registerKeyboardShortcuts } from '@/lib/editor/shortcuts/keyboard-actions';
import { setupRestrictedEditing } from '@/lib/editor/restricted-editing';
import { registerMonacoThemes, MONACO_THEME_ID, type AppTheme } from '@/lib/editor/monaco-themes';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onSubmit?: () => void;
}

export function CodeEditor({ code, onChange, onSubmit }: CodeEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const lintingCleanupRef = useRef<(() => void) | null>(null);
  const completionProviderRef = useRef<Monaco.IDisposable | null>(null);
  const restrictedEditingRef = useRef<Monaco.IDisposable | null>(null);

  const { theme: appTheme } = useTheme();
  const monacoTheme = MONACO_THEME_ID[appTheme as AppTheme] ?? 'app-midnight';

  // Handle editor mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Register all custom themes, then apply the current one
    registerMonacoThemes(monaco);
    monaco.editor.setTheme(MONACO_THEME_ID[appTheme as AppTheme] ?? 'app-midnight');

    // Register autocomplete provider
    completionProviderRef.current = registerCompletionProvider(monaco);

    // Register linting system
    lintingCleanupRef.current = registerLinting(monaco, editor);

    // Register keyboard shortcuts
    registerKeyboardShortcuts(monaco, editor, onSubmit);

    // Set up read-only regions for boilerplate code
    restrictedEditingRef.current = setupRestrictedEditing(monaco, editor);

    // Focus editor
    editor.focus();
  };

  // Sync Monaco theme with app theme
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(monacoTheme);
    }
  }, [monacoTheme]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (lintingCleanupRef.current) {
        lintingCleanupRef.current();
      }
      if (completionProviderRef.current) {
        completionProviderRef.current.dispose();
      }
      if (restrictedEditingRef.current) {
        restrictedEditingRef.current.dispose();
      }
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="relative h-full">
      <div className="code-editor h-full overflow-hidden rounded-md border border-border">
        <Editor
          height="100%"
          language="cpp"
          theme={monacoTheme}
          value={code}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'Courier New', monospace",
            fontLigatures: true,
            lineHeight: 1.6,
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            lineNumbers: 'on',
            wordWrap: 'off',
            tabSize: 4,
            automaticLayout: true,
            formatOnType: true,
            formatOnPaste: true,
          }}
        />
      </div>
    </div>
  );
}
