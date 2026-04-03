import { TestCase } from './problem';
import { SubmissionResult } from './judge';
import { VisualizationData } from './visualization';

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  visualization?: VisualizationData;
}

export interface ProblemContext {
  problemDescription: string;
  editorial: string;
  testCases: TestCase[];
  codeContext: string;
  lastSubmissionResult: SubmissionResult | null;
  previouslySolved: string[];
}

export interface ChatRequest {
  message: string;
  problemContext: ProblemContext;
  history?: { role: "user" | "assistant"; content: string }[];
}

export interface ChatResponse {
  reply: string;
  visualization?: VisualizationData;
}
