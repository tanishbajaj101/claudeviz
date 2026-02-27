import type { Problem } from "@algoarena/shared";
import { easyProblems } from "./problems/easy.js";
import { medium1Problems } from "./problems/medium1.js";
import { medium2Problems } from "./problems/medium2.js";
import { hard1Problems } from "./problems/hard1.js";
import { hard2Problems } from "./problems/hard2.js";

export const problems: Problem[] = [
  ...easyProblems,
  ...medium1Problems,
  ...medium2Problems,
  ...hard1Problems,
  ...hard2Problems,
];

export function getProblemById(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}

export function getProblems(): Problem[] {
  return problems;
}
