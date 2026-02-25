import { notFound } from "next/navigation";
import { ProfileClient } from "@/components/profile/ProfileClient";
import { getUserByUsername } from "@/lib/db";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;

  // Look up user by username
  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  return <ProfileClient userId={user.id} />;
}
