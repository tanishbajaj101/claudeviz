export type ProblemDifficulty = "easy" | "medium" | "hard";
export type ContestStatus = "upcoming" | "active" | "ended";

export interface Contest {
  id: string;
  title: string;
  creator_id: number;
  is_public: boolean;
  starts_at: Date | string;
  duration_minutes: number;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface ContestWithDetails extends Contest {
  creator: {
    username: string;
    avatar_svg: string;
  };
  problems: ContestProblemWithDetails[];
  participant_count: number;
  is_participant?: boolean;
}

export interface ContestProblem {
  id: string;
  contest_id: string;
  problem_id: string;
  order: number;
  difficulty: ProblemDifficulty;
}

export interface ContestProblemWithDetails extends ContestProblem {
  title?: string;
}

export interface ContestParticipant {
  id: string;
  contest_id: string;
  user_id: number;
  total_score: number;
  joined_at: Date | string;
}

export interface ContestSubmission {
  id: string;
  contest_id: string;
  user_id: number;
  problem_id: string;
  is_correct: boolean;
  score: number;
  submitted_at: Date | string;
}

export interface ContestLeaderboard {
  user_id: number;
  username: string;
  avatar_url: string | null;
  total_score: number;
  problems_solved: number;
  last_correct_at: string | null;
  per_problem: {
    problem_id: string;
    best_score: number;
    attempts: number;
  }[];
}

export interface ContestStatusInfo {
  status: ContestStatus;
  starts_at: Date;
  ends_at: Date;
  duration_minutes: number;
  time_until_start_ms?: number;
  time_remaining_ms?: number;
  is_active: boolean;
  has_ended: boolean;
}
