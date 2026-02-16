"use client";

import { useState } from "react";
import { TestCase, Judge0Limits, SubmissionResult } from "@/types";

interface UseJudgeReturn {
  results: SubmissionResult[];
  allPassed: boolean | null;
  loading: boolean;
  error: string | null;
  submit: (sourceCode: string, testCases: TestCase[], limits: Judge0Limits) => Promise<void>;
  reset: () => void;
}

export function useJudge(): UseJudgeReturn {
  const [results, setResults] = useState<SubmissionResult[]>([]);
  const [allPassed, setAllPassed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(
    sourceCode: string,
    testCases: TestCase[],
    limits: Judge0Limits
  ) {
    setLoading(true);
    setError(null);
    setResults([]);
    setAllPassed(null);

    try {
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode,
          languageId: 54,
          testCases,
          judge0Limits: limits,
        }),
      });

      if (!response.ok) {
        const errData = (await response.json()) as { error: string };
        throw new Error(errData.error);
      }

      const data = (await response.json()) as {
        results: SubmissionResult[];
        allPassed: boolean;
      };

      setResults(data.results);
      setAllPassed(data.allPassed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResults([]);
    setAllPassed(null);
    setError(null);
  }

  return { results, allPassed, loading, error, submit, reset };
}
