

import { useState, useEffect, useCallback } from "react";
import { VisualizationData } from "../../types";
import { VisualizationPlayer, VisualizationInputEditor } from "../../components/visualization";
import { executeVisualizationCode } from "../../components/visualization";
import type { Command } from "../../lib/tracers";

export function VisualizationRenderer({ data }: { data: VisualizationData }) {
  const [commands, setCommands] = useState<Command[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Build default INPUTS from data.inputs
  const [inputs, setInputs] = useState<Record<string, unknown>>(() => {
    if (!data.inputs) return {};

    const defaultInputs: Record<string, unknown> = {};
    data.inputs.forEach((input) => {
      defaultInputs[input.name] = input.defaultValue;
    });
    return defaultInputs;
  });

  const runVisualization = useCallback(async (inputValues: Record<string, unknown>) => {
    setLoading(true);
    setError(null);

    console.log('[Viz] Executing visualization code...');
    console.log('[Viz] Code length:', data.code.length);
    console.log('[Viz] Has LogTracer:', data.code.includes('new LogTracer'));
    console.log('[Viz] Has logger calls:', /logger\.(println|print)/.test(data.code));
    console.log('[Viz] Inputs:', inputValues);

    const result = await executeVisualizationCode(data.code, inputValues);

    console.log('[Viz] Execution result:', result);
    console.log('[Viz] Commands received:', result.commands?.length || 0);

    if (result.commands && result.commands.length > 0) {
      console.log('[Viz] First 10 commands:', result.commands.slice(0, 10));

      const commandsByMethod = result.commands.reduce((acc, cmd) => {
        acc[cmd.method] = (acc[cmd.method] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('[Viz] Command counts:', commandsByMethod);

      const hasLogTracerCommands = result.commands.some(
        c => c.method === 'LogTracer' || c.method === 'println' || c.method === 'print'
      );
      console.log('[Viz] Has LogTracer commands:', hasLogTracerCommands);
    }

    if (result.success && result.commands) {
      setCommands(result.commands);
    } else {
      setError(result.error || 'Visualization failed');
    }

    setLoading(false);
  }, [data.code]);

  useEffect(() => {
    runVisualization(inputs);
  }, [data.code]); // Only run on mount or when code changes

  const handleRerun = (newInputs: Record<string, unknown>) => {
    setInputs(newInputs);
    runVisualization(newInputs);
  };

  if (loading) {
    return (
      <div className="rounded-md border border-zinc-700 bg-zinc-900 p-4 text-center">
        <p className="font-mono text-xs text-zinc-500">Loading visualization...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-900/50 bg-red-950/20 p-3">
        <p className="font-mono text-xs text-red-400">{data.description}</p>
        <p className="mt-2 font-mono text-xs text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {data.inputs && data.inputs.length > 0 && (
        <VisualizationInputEditor inputs={data.inputs} onRerun={handleRerun} />
      )}
      <div className="rounded-md border border-zinc-700 bg-zinc-900 p-3">
        <p className="mb-3 font-mono text-xs text-zinc-400">{data.description}</p>
        <VisualizationPlayer commands={commands} />
      </div>
    </div>
  );
}
