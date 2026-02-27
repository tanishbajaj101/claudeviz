import { TestCase, Judge0Limits } from './problem';

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
