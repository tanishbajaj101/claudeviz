import { getProblems } from "@/lib/problems";
import { ProblemTable } from "@/components/problems/ProblemTable";

export default function HomePage() {
  const problems = getProblems();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-100">
          Problems
        </h1>
        <p className="mt-2 font-mono text-sm text-zinc-500">
          {problems.length} problems available. Pick one and start coding.
        </p>
      </div>
      <ProblemTable problems={problems} />
    </main>
  );
}
