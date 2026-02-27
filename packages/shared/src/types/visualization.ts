export interface VisualizationInput {
  name: string;
  label: string;
  type: "array" | "number" | "string" | "matrix";
  defaultValue: unknown;
}

export interface VisualizationData {
  type: "visualization";
  code: string;
  description: string;
  inputs?: VisualizationInput[];
}
