"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getProblems } from "@/data/problems";
import Image from "next/image";

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  Medium: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  Hard: "text-red-400 border-red-500/30 bg-red-500/10",
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const problems = getProblems();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="font-mono text-sm text-zinc-500">Loading...</p>
      </main>
    );
  }

  if (!session?.user) return null;

  const categories = Array.from(new Set(problems.map((p) => p.category)));
  const byDifficulty = {
    Easy: problems.filter((p) => p.difficulty === "Easy"),
    Medium: problems.filter((p) => p.difficulty === "Medium"),
    Hard: problems.filter((p) => p.difficulty === "Hard"),
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Profile header */}
      <div className="mb-8 flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt=""
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="font-mono text-xl font-bold text-zinc-100">
            {session.user.name}
          </h1>
          <p className="font-mono text-sm text-zinc-500">
            {session.user.email}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {(["Easy", "Medium", "Hard"] as const).map((diff) => (
          <div
            key={diff}
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <p className="font-mono text-xs text-zinc-500">{diff}</p>
            <p
              className={`font-mono text-2xl font-bold ${DIFFICULTY_COLORS[diff].split(" ")[0]}`}
            >
              0
              <span className="text-sm text-zinc-600">
                /{byDifficulty[diff].length}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="mb-8">
        <h2 className="mb-4 font-mono text-lg font-bold text-zinc-200">
          Categories
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const catProblems = problems.filter((p) => p.category === cat);
            return (
              <div
                key={cat}
                className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-3"
              >
                <span className="font-mono text-sm text-zinc-300">{cat}</span>
                <span className="font-mono text-xs text-zinc-500">
                  0/{catProblems.length}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Problem grid */}
      <div>
        <h2 className="mb-4 font-mono text-lg font-bold text-zinc-200">
          All Problems
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {problems.map((p) => (
            <a
              key={p.id}
              href={`/problems/${p.id}`}
              className={`flex flex-col items-center justify-center rounded-md border p-3 transition-colors hover:opacity-80 ${DIFFICULTY_COLORS[p.difficulty]}`}
            >
              <span className="font-mono text-xs">{p.title}</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
