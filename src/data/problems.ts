import { Problem } from "@/types";
import { easyProblems } from "./problems/easy";
import { medium1Problems } from "./problems/medium1";
import { medium2Problems } from "./problems/medium2";
import { hard1Problems } from "./problems/hard1";
import { hard2Problems } from "./problems/hard2";

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
