import { Judge0Limits, Judge0Result } from "@/types";

function normalizeApiUrl(url: string): string {
  if (!url) return "";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url.replace(/\/+$/, ""); // trim trailing slashes
}

function getRapidApiHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

const JUDGE0_API_URL = normalizeApiUrl(process.env.JUDGE0_API_URL ?? "");
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY ?? "";

function toBase64(str: string): string {
  return Buffer.from(str).toString("base64");
}

function fromBase64(str: string): string {
  return Buffer.from(str, "base64").toString("utf-8");
}

interface SubmitParams {
  sourceCode: string;
  languageId: number;
  stdin: string;
  expectedOutput: string;
  limits: Judge0Limits;
}

export async function submitCode(params: SubmitParams): Promise<Judge0Result> {
  const { sourceCode, languageId, stdin, expectedOutput, limits } = params;

  const body = {
    source_code: toBase64(sourceCode),
    language_id: languageId,
    stdin: toBase64(stdin),
    expected_output: toBase64(expectedOutput),
    cpu_time_limit: limits.cpu_time_limit,
    cpu_extra_time: 0.5,
    wall_time_limit: limits.wall_time_limit,
    memory_limit: limits.memory_limit,
    stack_size_limit: limits.stack_limit,
  };

  const submitResponse = await fetch(
    `${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=false`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": JUDGE0_API_KEY,
        "X-RapidAPI-Host": getRapidApiHost(JUDGE0_API_URL),
      },
      body: JSON.stringify(body),
    }
  );

  if (!submitResponse.ok) {
    const errText = await submitResponse.text();
    throw new Error(`Judge0 submission failed: ${submitResponse.status} ${errText}`);
  }

  const { token } = (await submitResponse.json()) as { token: string };

  return pollResult(token);
}

async function pollResult(token: string): Promise<Judge0Result> {
  const maxAttempts = 30;
  const delayMs = 1000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    const response = await fetch(
      `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true&fields=status,stdout,stderr,compile_output,time,memory`,
      {
        headers: {
          "X-RapidAPI-Key": JUDGE0_API_KEY,
          "X-RapidAPI-Host": getRapidApiHost(JUDGE0_API_URL),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Judge0 poll failed: ${response.status}`);
    }

    const result = (await response.json()) as {
      status: { id: number; description: string };
      stdout: string | null;
      stderr: string | null;
      compile_output: string | null;
      time: string | null;
      memory: number | null;
    };

    // Status 1 = In Queue, Status 2 = Processing
    if (result.status.id <= 2) {
      continue;
    }

    return {
      status: result.status,
      stdout: result.stdout ? fromBase64(result.stdout) : null,
      stderr: result.stderr ? fromBase64(result.stderr) : null,
      compile_output: result.compile_output
        ? fromBase64(result.compile_output)
        : null,
      time: result.time,
      memory: result.memory,
    };
  }

  throw new Error("Judge0 submission timed out after polling");
}
