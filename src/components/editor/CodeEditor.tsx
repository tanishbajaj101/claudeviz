"use client";

import { useCallback } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/themes/prism-tomorrow.css";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  const highlight = useCallback((value: string) => {
    return Prism.highlight(value, Prism.languages.cpp, "cpp");
  }, []);

  return (
    <div className="code-editor h-full overflow-auto rounded-md border border-zinc-800 bg-[#1d1f21]">
      <Editor
        value={code}
        onValueChange={onChange}
        highlight={highlight}
        padding={16}
        style={{
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          fontSize: 14,
          lineHeight: 1.6,
          minHeight: "100%",
          color: "#c5c8c6",
        }}
      />
    </div>
  );
}
