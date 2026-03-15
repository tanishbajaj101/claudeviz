import { useState, useEffect, useCallback } from "react";
import { VisualizationData } from "../../types";
import { VisualizationPlayer, VisualizationInputEditor } from "../../components/visualization";
import { executeVisualizationCode } from "../../components/visualization";

export function VisualizationRenderer({ data }: { data: VisualizationData }) {
  const [steps, setSteps] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
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
    const result = await executeVisualizationCode(data.code, inputValues);

    console.log('[Viz] Execution result:', result);

    if (result.success && result.steps && result.config) {
      setSteps(result.steps);
      setConfig(result.config);
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
      <div className="rounded-md border border-border bg-card p-4 text-center">
        <p className="font-mono text-xs text-muted-foreground">Loading visualization...</p>
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
      <div className="rounded-md border border-border bg-card p-3">
        <p className="mb-3 font-mono text-xs text-muted-foreground">{data.description}</p>
        <VisualizationPlayer config={config} steps={steps} />
      </div>
    </div>
  );
}
