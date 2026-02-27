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
