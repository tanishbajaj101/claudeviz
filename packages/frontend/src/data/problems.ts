import { Problem } from "@/types";
import { importedProblems } from "./problems/all_problems";
import { specialProblems } from "./problems/special_problems";

export const problems: Problem[] = [
  ...importedProblems,
];

export function getProblemById(id: string): Problem | undefined {
  return [...problems, ...specialProblems].find((p) => p.id === id);
}

export function getProblems(): Problem[] {
  return problems;
}

export function getSpecialProblems(): Problem[] {
  return specialProblems;
}
