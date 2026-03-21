export interface DbUser {
  id: number;
  google_id: string;
  email: string;
  name: string;
  username: string;
  avatar_svg: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar: string;
}

export interface UserProfile {
  solvedProblems: string[];
  submissions: UserSubmission[];
  xp?: number;
}

export interface UserSubmission {
  problemId: string;
  timestamp: string;
  status: string;
  time: string | null;
  memory: number | null;
}

export interface Session {
  user: User;
  expires: string;
}
