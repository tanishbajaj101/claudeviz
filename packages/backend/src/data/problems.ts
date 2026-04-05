import type { Problem } from "@algoarena/shared";
import { importedProblems } from "./problems/all_problems.js";
import { specialProblems } from "./problems/special_problems.js";

export const problems: Problem[] = [
  ...importedProblems,
];

export function getProblemById(id: string): Problem | undefined {
  return [...problems, ...specialProblems].find((p) => p.id === id);
}

export function getProblems(): Problem[] {
  return problems;
}
