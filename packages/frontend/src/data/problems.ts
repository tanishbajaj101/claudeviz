import { Problem } from "@/types";
import { importedProblems } from "./problems/all_problems";

export const problems: Problem[] = [
  ...importedProblems,
];

export function getProblemById(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}

export function getProblems(): Problem[] {
  return problems;
}
