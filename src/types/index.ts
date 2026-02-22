export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  tags: string[];
  description: string;
  constraints: string[];
  examples: ProblemExample[];
  testCases: TestCase[];
  judge0Limits: Judge0Limits;
  languageId: 54;
  starterCode: string;
  editorial: string;
  acceptanceRate?: number;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Judge0Limits {
  cpu_time_limit: number;
  wall_time_limit: number;
  memory_limit: number;
  stack_limit: number;
}

export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output: string;
  cpu_time_limit: number;
  cpu_extra_time?: number;
  wall_time_limit: number;
  memory_limit: number;
  stack_size_limit: number;
}

export interface Judge0Result {
  status: {
    id: number;
    description: string;
  };
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  time: string | null;
  memory: number | null;
}

export interface SubmissionResult {
  testCaseIndex: number;
  status: Judge0Result["status"];
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  time: string | null;
  memory: number | null;
  input: string;
  expectedOutput: string;
  passed: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  visualization?: VisualizationData;
}

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
}

export interface ChatResponse {
  reply: string;
  visualization?: VisualizationData;
}

export interface JudgeRequest {
  sourceCode: string;
  languageId: number;
  testCases: TestCase[];
  judge0Limits: Judge0Limits;
}

export interface JudgeResponse {
  results: SubmissionResult[];
  allPassed: boolean;
}

export interface UserProfile {
  solvedProblems: string[];
  submissions: UserSubmission[];
}

export interface UserSubmission {
  problemId: string;
  timestamp: string;
  status: string;
  time: string | null;
  memory: number | null;
}

export interface DbUser {
  id: number;
  google_id: string;
  email: string;
  name: string;
  username: string;
  avatar_svg: string;
  created_at: string;
}

export interface DbSubmission {
  id: number;
  user_id: number;
  problem_id: string;
  status: string;
  time: string | null;
  memory: number | null;
  created_at: string;
}
