"use client";

import { useState } from "react";
import { VisualizationInput } from "@/types";

interface VisualizationInputEditorProps {
  inputs: VisualizationInput[];
  onRerun: (values: Record<string, unknown>) => void;
}

export function VisualizationInputEditor({
  inputs,
  onRerun,
}: VisualizationInputEditorProps) {
  // Initialize values from defaults
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    inputs.forEach((input) => {
      if (input.type === "array" || input.type === "matrix") {
        initial[input.name] = JSON.stringify(input.defaultValue);
      } else {
        initial[input.name] = String(input.defaultValue);
      }
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input change
  const handleChange = (name: string, value: string, type: VisualizationInput["type"]) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    // Validate on change
    let error = "";
    if (type === "array" || type === "matrix") {
      try {
        JSON.parse(value);
      } catch {
        error = "Invalid JSON";
      }
    } else if (type === "number") {
      if (isNaN(Number(value))) {
        error = "Must be a number";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Reset to defaults
  const handleReset = () => {
    const defaults: Record<string, string> = {};
    inputs.forEach((input) => {
      if (input.type === "array" || input.type === "matrix") {
        defaults[input.name] = JSON.stringify(input.defaultValue);
      } else {
        defaults[input.name] = String(input.defaultValue);
      }
    });
    setValues(defaults);
    setErrors({});
  };

  // Re-run visualization
  const handleRerun = () => {
    // Check for errors
    const hasErrors = Object.values(errors).some((err) => err !== "");
    if (hasErrors) return;

    // Parse values to correct types
    const parsedValues: Record<string, unknown> = {};
    inputs.forEach((input) => {
      const value = values[input.name];
      if (input.type === "array" || input.type === "matrix") {
        try {
          parsedValues[input.name] = JSON.parse(value);
        } catch {
          // Should not happen due to validation
          parsedValues[input.name] = input.defaultValue;
        }
      } else if (input.type === "number") {
        parsedValues[input.name] = Number(value);
      } else {
        parsedValues[input.name] = value;
      }
    });

    onRerun(parsedValues);
  };

  const hasErrors = Object.values(errors).some((err) => err !== "");

  return (
    <div className="rounded-md border border-zinc-700 bg-zinc-900 p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-mono text-xs font-semibold text-zinc-300">
          Input Parameters
        </h4>
        <button
          onClick={handleReset}
          className="font-mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="space-y-2 mb-3">
        {inputs.map((input) => {
          const value = values[input.name] || "";
          const error = errors[input.name];

          return (
            <div key={input.name}>
              <label className="block font-mono text-xs text-zinc-400 mb-1">
                {input.label}
              </label>
              {input.type === "number" ? (
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleChange(input.name, e.target.value, input.type)}
                  className={`w-full rounded border bg-zinc-800 px-2 py-1 font-mono text-xs text-zinc-200 focus:outline-none focus:ring-1 ${
                    error
                      ? "border-red-500 focus:ring-red-500"
                      : "border-zinc-700 focus:ring-blue-500"
                  }`}
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(input.name, e.target.value, input.type)}
                  placeholder={
                    input.type === "array" || input.type === "matrix"
                      ? "e.g., [1, 2, 3]"
                      : "Enter value"
                  }
                  className={`w-full rounded border bg-zinc-800 px-2 py-1 font-mono text-xs text-zinc-200 focus:outline-none focus:ring-1 ${
                    error
                      ? "border-red-500 focus:ring-red-500"
                      : "border-zinc-700 focus:ring-blue-500"
                  }`}
                />
              )}
              {error && (
                <p className="mt-1 font-mono text-xs text-red-400">{error}</p>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleRerun}
        disabled={hasErrors}
        className={`w-full rounded px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
          hasErrors
            ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Re-run Visualization
      </button>
    </div>
  );
}
