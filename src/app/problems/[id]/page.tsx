import { notFound } from "next/navigation";
import { getProblemById, getProblems } from "@/lib/problems";
import { ProblemWorkspace } from "@/components/problems/ProblemWorkspace";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getProblems().map((p) => ({ id: p.id }));
}

export default async function ProblemPage({ params }: PageProps) {
  const { id } = await params;
  const problem = getProblemById(id);

  if (!problem) {
    notFound();
  }

  return <ProblemWorkspace problem={problem} />;
}
