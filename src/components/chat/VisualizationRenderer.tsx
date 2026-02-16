"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { VisualizationData } from "@/types";

interface TracerStep {
  arrays: Record<string, ArrayState>;
  logs: string[];
}

interface ArrayState {
  label: string;
  data: number[];
  selected: Set<number>;
  patched: Set<number>;
}

function executeVisualization(code: string): TracerStep[] {
  const steps: TracerStep[] = [];
  const arrays: Record<string, { label: string; data: number[]; selected: Set<number>; patched: Set<number> }> = {};
  let logs: string[] = [];
  let tracerCounter = 0;

  function captureStep() {
    const snapshot: TracerStep = { arrays: {}, logs: [...logs] };
    for (const [id, arr] of Object.entries(arrays)) {
      snapshot.arrays[id] = {
        label: arr.label,
        data: [...arr.data],
        selected: new Set(arr.selected),
        patched: new Set(arr.patched),
      };
    }
    steps.push(snapshot);
  }

  class MockArray1DTracer {
    id: string;
    label: string;
    data: number[];
    selected: Set<number>;
    patched: Set<number>;

    constructor(label?: string) {
      this.id = `arr_${tracerCounter++}`;
      this.label = label ?? "Array";
      this.data = [];
      this.selected = new Set();
      this.patched = new Set();
      arrays[this.id] = this;
    }
    set(data: number[]) { this.data = [...data]; }
    select(i: number, j?: number) {
      if (j !== undefined) {
        for (let k = i; k <= j; k++) this.selected.add(k);
      } else {
        this.selected.add(i);
      }
    }
    deselect(i: number, j?: number) {
      if (j !== undefined) {
        for (let k = i; k <= j; k++) this.selected.delete(k);
      } else {
        this.selected.delete(i);
      }
    }
    patch(i: number) { this.patched.add(i); }
    depatch(i: number) { this.patched.delete(i); }
    chart() { /* no-op for rendering */ }
  }

  class MockLogTracer {
    constructor(label?: string) {
      void label;
    }
    println(msg: string) { logs.push(String(msg)); }
  }

  class MockLayout {
    static setRoot() { /* no-op */ }
  }

  class MockVerticalLayout {
    constructor(_items: unknown[]) { /* no-op */ }
  }

  class MockHorizontalLayout {
    constructor(_items: unknown[]) { /* no-op */ }
  }

  class MockTracer {
    static delay() { captureStep(); }
  }

  class MockChartTracer {
    constructor() { /* no-op */ }
  }

  class MockGraphTracer {
    constructor() { tracerCounter++; }
    set() { /* no-op */ }
    visit() { /* no-op */ }
    leave() { /* no-op */ }
  }

  class MockArray2DTracer extends MockArray1DTracer {
    set(data: number[] | number[][]) {
      if (Array.isArray(data[0])) {
        this.data = (data as number[][]).flat();
      } else {
        this.data = [...(data as number[])];
      }
    }
  }

  const mockRequire = (mod: string) => {
    if (mod === "algorithm-visualizer") {
      return {
        Tracer: MockTracer,
        Array1DTracer: MockArray1DTracer,
        Array2DTracer: MockArray2DTracer,
        GraphTracer: MockGraphTracer,
        ChartTracer: MockChartTracer,
        LogTracer: MockLogTracer,
        Layout: MockLayout,
        VerticalLayout: MockVerticalLayout,
        HorizontalLayout: MockHorizontalLayout,
      };
    }
    throw new Error(`Unknown module: ${mod}`);
  };

  try {
    const fn = new Function("require", code);
    fn(mockRequire);
  } catch (err) {
    logs.push(`Error: ${err instanceof Error ? err.message : String(err)}`);
    captureStep();
  }

  if (steps.length === 0) {
    captureStep();
  }

  return steps;
}

export function VisualizationRenderer({ data }: { data: VisualizationData }) {
  const [steps, setSteps] = useState<TracerStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const result = executeVisualization(data.code);
    setSteps(result);
    setCurrentStep(0);
  }, [data.code]);

  useEffect(() => {
    if (playing && currentStep < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, steps.length, currentStep]);

  const togglePlay = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  }, [currentStep, steps.length]);

  const stepForward = useCallback(() => {
    setPlaying(false);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const stepBackward = useCallback(() => {
    setPlaying(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  if (steps.length === 0) return null;

  const step = steps[currentStep];

  return (
    <div className="rounded-md border border-zinc-700 bg-zinc-900 p-3">
      <p className="mb-2 font-mono text-xs text-zinc-400">{data.description}</p>

      {/* Array visualizations */}
      {Object.entries(step.arrays).map(([id, arr]) => (
        <div key={id} className="mb-3">
          <p className="mb-1 font-mono text-xs text-zinc-500">{arr.label}</p>
          <div className="flex flex-wrap gap-1">
            {arr.data.map((val, i) => {
              const isPatched = arr.patched.has(i);
              const isSelected = arr.selected.has(i);
              let bg = "bg-zinc-800";
              if (isPatched) bg = "bg-amber-500/30 border-amber-500";
              else if (isSelected) bg = "bg-blue-500/30 border-blue-500";

              return (
                <div
                  key={i}
                  className={`flex h-10 w-10 items-center justify-center rounded border ${bg} ${
                    !isPatched && !isSelected ? "border-zinc-700" : ""
                  } font-mono text-xs text-zinc-200 transition-all duration-200`}
                >
                  {val}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Log output */}
      {step.logs.length > 0 && (
        <div className="mb-3 max-h-32 overflow-y-auto rounded border border-zinc-700 bg-zinc-950 p-2">
          {step.logs.map((log, i) => (
            <p key={i} className="font-mono text-xs text-zinc-400">
              {log}
            </p>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={stepBackward}
          disabled={currentStep === 0}
          className="rounded border border-zinc-700 px-2 py-1 font-mono text-xs text-zinc-400 transition-colors hover:bg-zinc-800 disabled:opacity-30"
        >
          Prev
        </button>
        <button
          onClick={togglePlay}
          className="rounded border border-zinc-700 px-3 py-1 font-mono text-xs text-zinc-400 transition-colors hover:bg-zinc-800"
        >
          {playing ? "Pause" : currentStep >= steps.length - 1 ? "Replay" : "Play"}
        </button>
        <button
          onClick={stepForward}
          disabled={currentStep >= steps.length - 1}
          className="rounded border border-zinc-700 px-2 py-1 font-mono text-xs text-zinc-400 transition-colors hover:bg-zinc-800 disabled:opacity-30"
        >
          Next
        </button>
        <span className="ml-auto font-mono text-xs text-zinc-600">
          Step {currentStep + 1} / {steps.length}
        </span>
      </div>
    </div>
  );
}
