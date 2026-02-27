/**
 * Problems library - Frontend stub
 *
 * TODO (Task #12): Replace with proper API calls or import from shared package
 */

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  constraints: string[];
  examples: Array<{ input: string; output: string; explanation?: string }>;
  testCases: Array<{ input: string; expected: string }>;
  timeLimit: number;
  memoryLimit: number;
  stackLimit: number;
}

// Placeholder data - will be replaced with API calls
const PLACEHOLDER_PROBLEMS: Problem[] = [];

export function getProblems(): Problem[] {
  return PLACEHOLDER_PROBLEMS;
}

export function getProblemById(id: string): Problem | undefined {
  return PLACEHOLDER_PROBLEMS.find((p) => p.id === id);
}

export { PLACEHOLDER_PROBLEMS as problems };
