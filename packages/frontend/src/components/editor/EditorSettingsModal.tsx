import { useState } from 'react';
import { X } from 'lucide-react';
import type { EditorPreferences } from '@/types/editor';

interface EditorSettingsModalProps {
  currentPrefs: EditorPreferences;
  onSave: (prefs: EditorPreferences) => void;
  onClose: () => void;
}

export function EditorSettingsModal({ currentPrefs, onSave, onClose }: EditorSettingsModalProps) {
  const [prefs, setPrefs] = useState<EditorPreferences>(currentPrefs);

  const handleSave = () => {
    onSave(prefs);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Editor Settings</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Settings Form */}
        <div className="space-y-4">
          {/* Font Size */}
          <div>
            <label className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>Font Size</span>
              <span className="text-muted-foreground">{prefs.fontSize}px</span>
            </label>
            <input
              type="range"
              min="12"
              max="24"
              step="1"
              value={prefs.fontSize}
              onChange={(e) => setPrefs({ ...prefs, fontSize: Number(e.target.value) })}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Theme */}
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">Theme</label>
            <select
              value={prefs.theme}
              onChange={(e) => setPrefs({ ...prefs, theme: e.target.value as 'vs-dark' | 'vs-light' })}
              className="w-full rounded border border-border bg-muted px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="vs-dark">Dark</option>
              <option value="vs-light">Light</option>
            </select>
          </div>

          {/* Tab Size */}
          <div>
            <label className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>Tab Size</span>
              <span className="text-muted-foreground">{prefs.tabSize} spaces</span>
            </label>
            <input
              type="range"
              min="2"
              max="8"
              step="2"
              value={prefs.tabSize}
              onChange={(e) => setPrefs({ ...prefs, tabSize: Number(e.target.value) })}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Line Numbers */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Line Numbers</label>
            <input
              type="checkbox"
              checked={prefs.lineNumbers}
              onChange={(e) => setPrefs({ ...prefs, lineNumbers: e.target.checked })}
              className="h-4 w-4 accent-emerald-500"
            />
          </div>

          {/* Word Wrap */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Word Wrap</label>
            <input
              type="checkbox"
              checked={prefs.wordWrap === 'on'}
              onChange={(e) => setPrefs({ ...prefs, wordWrap: e.target.checked ? 'on' : 'off' })}
              className="h-4 w-4 accent-emerald-500"
            />
          </div>

          {/* Minimap */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Minimap</label>
            <input
              type="checkbox"
              checked={prefs.minimap}
              onChange={(e) => setPrefs({ ...prefs, minimap: e.target.checked })}
              className="h-4 w-4 accent-emerald-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded border border-border bg-muted px-4 py-2 text-sm text-muted-foreground hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded border border-emerald-500 bg-primary/10 px-4 py-2 text-sm text-emerald-400 hover:bg-primary/20"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
