import { useState } from "react";
import { TestCase, Judge0Limits, SubmissionResult } from "@/types";
import { api } from "../lib/api-client";

interface UseJudgeReturn {
  results: SubmissionResult[];
  allPassed: boolean | null;
  loading: boolean;
  error: string | null;
  submit: (sourceCode: string, testCases: TestCase[], limits: Judge0Limits) => Promise<void>;
  reset: () => void;
}

interface JudgeResponse {
  results: SubmissionResult[];
  allPassed: boolean;
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
      const data = await api.post<JudgeResponse>("/api/judge", {
        sourceCode,
        languageId: 54,
        testCases,
        judge0Limits: limits,
      });

      setResults(data.results);
      setAllPassed(data.allPassed);
    } catch (err: any) {
      setError(err.data?.error || err.message || "Submission failed");
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
