export interface EditorPreferences {
  fontSize: number;
  theme: 'vs-dark' | 'vs-light';
  lineNumbers: boolean;
  wordWrap: 'on' | 'off';
  minimap: boolean;
  tabSize: number;
}

export interface VariableDeclaration {
  name: string;
  type: string;
  line: number;
}

export interface LintError {
  line: number;
  column: number;
  endColumn: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface MethodDefinition {
  label: string;
  snippet: string;
  signature: string;
  documentation: string;
  kind: 'Method' | 'Field';
}
