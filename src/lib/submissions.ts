import { UserProfile, UserSubmission } from "@/types";

const STORAGE_KEY_PREFIX = "algoarena_profile_";

function getStorageKey(userEmail: string): string {
  return `${STORAGE_KEY_PREFIX}${userEmail}`;
}

export function getUserProfile(userEmail: string): UserProfile {
  if (typeof window === "undefined") {
    return { solvedProblems: [], submissions: [] };
  }
  try {
    const raw = localStorage.getItem(getStorageKey(userEmail));
    if (!raw) return { solvedProblems: [], submissions: [] };
    return JSON.parse(raw) as UserProfile;
  } catch {
    return { solvedProblems: [], submissions: [] };
  }
}

export function saveSubmission(
  userEmail: string,
  problemId: string,
  submission: UserSubmission
): UserProfile {
  const profile = getUserProfile(userEmail);

  profile.submissions.push(submission);

  // If accepted (status "Accepted") and not already in solvedProblems, add it
  if (
    submission.status === "Accepted" &&
    !profile.solvedProblems.includes(problemId)
  ) {
    profile.solvedProblems.push(problemId);
  }

  localStorage.setItem(getStorageKey(userEmail), JSON.stringify(profile));
  return profile;
}

export function getSolvedProblems(userEmail: string): string[] {
  return getUserProfile(userEmail).solvedProblems;
}
