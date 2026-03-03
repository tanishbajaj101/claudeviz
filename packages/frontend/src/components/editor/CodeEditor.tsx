import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <div className="code-editor h-full overflow-hidden rounded-md border border-zinc-800">
      <Editor
        height="100%"
        language="cpp"
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          lineHeight: 1.6,
          scrollBeyondLastLine: false,
          padding: { top: 16 },
        }}
      />
    </div>
  );
}
