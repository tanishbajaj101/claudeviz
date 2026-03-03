import type { EditorPreferences } from '@/types/editor';

const STORAGE_KEY = 'algoarena-editor-prefs';

export const DEFAULT_PREFERENCES: EditorPreferences = {
  fontSize: 14,
  theme: 'vs-dark',
  lineNumbers: true,
  wordWrap: 'off',
  minimap: false,
  tabSize: 2,
};

export function loadPreferences(): EditorPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(stored) as Partial<EditorPreferences>;

    // Merge with defaults to ensure all properties exist
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
    };
  } catch (error) {
    console.warn('Failed to load editor preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences: EditorPreferences): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Failed to save editor preferences:', error);
    return false;
  }
}
