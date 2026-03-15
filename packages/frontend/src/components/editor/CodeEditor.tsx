import { useRef, useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Editor, { OnMount } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';
import { Settings } from 'lucide-react';
import { EditorSettingsModal } from './EditorSettingsModal';
import { loadPreferences, savePreferences } from '@/lib/editor/preferences/editor-preferences';
import { registerCompletionProvider } from '@/lib/editor/autocomplete/completion-provider';
import { registerLinting } from '@/lib/editor/linting/diagnostic-provider';
import { registerKeyboardShortcuts } from '@/lib/editor/shortcuts/keyboard-actions';
import type { EditorPreferences } from '@/types/editor';
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

  const [preferences, setPreferences] = useState<EditorPreferences>(() => loadPreferences());
  const [showSettings, setShowSettings] = useState(false);
  const { theme: appTheme } = useTheme();
  const monacoTheme = MONACO_THEME_ID[appTheme as AppTheme] ?? 'app-dark';

  // Handle editor mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Register all custom themes, then apply the current one
    registerMonacoThemes(monaco);
    monaco.editor.setTheme(MONACO_THEME_ID[appTheme as AppTheme] ?? 'app-dark');

    // Register autocomplete provider
    completionProviderRef.current = registerCompletionProvider(monaco);

    // Register linting system
    lintingCleanupRef.current = registerLinting(monaco, editor);

    // Register keyboard shortcuts
    registerKeyboardShortcuts(monaco, editor, onSubmit);

    // Focus editor
    editor.focus();
  };

  // Sync Monaco theme with app theme
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(monacoTheme);
    }
  }, [monacoTheme]);

  // Update editor options when preferences change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: preferences.fontSize,
        lineNumbers: preferences.lineNumbers ? 'on' : 'off',
        wordWrap: preferences.wordWrap,
        minimap: { enabled: preferences.minimap },
        tabSize: preferences.tabSize,
      });
    }
  }, [preferences]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (lintingCleanupRef.current) {
        lintingCleanupRef.current();
      }
      if (completionProviderRef.current) {
        completionProviderRef.current.dispose();
      }
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  const handleSavePreferences = (newPrefs: EditorPreferences) => {
    setPreferences(newPrefs);
    savePreferences(newPrefs);
  };

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
            minimap: { enabled: preferences.minimap },
            fontSize: preferences.fontSize,
            fontFamily: 'var(--font-mono), ui-monospace, monospace',
            lineHeight: 1.6,
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            lineNumbers: preferences.lineNumbers ? 'on' : 'off',
            wordWrap: preferences.wordWrap,
            tabSize: preferences.tabSize,
            automaticLayout: true,
            formatOnType: true,
            formatOnPaste: true,
          }}
        />
      </div>

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute right-4 top-4 rounded border border-border bg-card/90 p-2 text-muted-foreground hover:bg-muted hover:text-white"
        title="Editor Settings"
      >
        <Settings className="h-4 w-4" />
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <EditorSettingsModal
          currentPrefs={preferences}
          onSave={handleSavePreferences}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
