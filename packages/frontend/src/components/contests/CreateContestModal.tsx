

import { useState, useEffect } from "react";
import { X, Plus, Minus, Loader2 } from "lucide-react";
import { problems } from "../../data/problems";

interface CreateContestModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ProblemSlot {
  difficulty: "easy" | "medium" | "hard";
  topics: string[];
}

interface Friend {
  id: number;
  username: string;
  avatar_url: string | null;
}

export function CreateContestModal({ onClose, onSuccess }: CreateContestModalProps) {
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [startTime, setStartTime] = useState("");
  const [questionCount, setQuestionCount] = useState(3);
  const [duration, setDuration] = useState(45);
  const [problemSlots, setProblemSlots] = useState<ProblemSlot[]>([
    { difficulty: "easy", topics: [] },
    { difficulty: "medium", topics: [] },
    { difficulty: "hard", topics: [] },
  ]);
  const [globalTopics, setGlobalTopics] = useState<string[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all unique tags from problems
  const allTags = Array.from(new Set(problems.flatMap((p) => p.tags))).sort();

  useEffect(() => {
    // Fetch friends list
    fetch("/api/friends")
      .then((res) => res.json())
      .then((data) => setFriends(data.friends || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Auto-suggest duration based on question count
    setDuration(questionCount * 15);
  }, [questionCount]);

  useEffect(() => {
    // Update problem slots when question count changes
    const newSlots: ProblemSlot[] = [];
    for (let i = 0; i < questionCount; i++) {
      if (problemSlots[i]) {
        newSlots.push(problemSlots[i]);
      } else {
        // Default difficulty pattern: easy -> medium -> hard
        const difficulty =
          i % 3 === 0 ? "easy" : i % 3 === 1 ? "medium" : "hard";
        newSlots.push({ difficulty, topics: [...globalTopics] });
      }
    }
    setProblemSlots(newSlots);
  }, [questionCount]);

  useEffect(() => {
    // Apply global topics to all slots
    setProblemSlots((prev) =>
      prev.map((slot) => ({ ...slot, topics: [...globalTopics] }))
    );
  }, [globalTopics]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim()) {
      setError("Contest title is required");
      return;
    }

    if (!startTime) {
      setError("Start time is required");
      return;
    }

    const startsAt = new Date(startTime);
    if (startsAt <= new Date()) {
      setError("Start time must be in the future");
      return;
    }

    // Validate each problem slot has at least one topic
    for (let i = 0; i < problemSlots.length; i++) {
      if (problemSlots[i].topics.length === 0) {
        setError(`Problem ${i + 1} must have at least one topic selected`);
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          is_public: isPublic,
          starts_at: startsAt.toISOString(),
          duration_minutes: duration,
          problems: problemSlots,
          invited_user_ids: selectedFriends.length > 0 ? selectedFriends : undefined,
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create contest");
      }
    } catch (err) {
      console.error("[CreateContestModal] Error:", err);
      setError("Failed to create contest");
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topic: string) => {
    setGlobalTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const toggleFriend = (friendId: number) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 font-mono text-2xl font-bold text-zinc-100">
          Create Contest
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="mb-2 block font-mono text-sm font-medium text-zinc-300">
              Contest Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
              placeholder="Weekly Challenge"
            />
          </div>

          {/* Public/Private */}
          <div>
            <label className="mb-2 block font-mono text-sm font-medium text-zinc-300">
              Visibility
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex-1 rounded-md border px-4 py-2 font-mono text-sm transition-colors ${
                  isPublic
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                Public
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex-1 rounded-md border px-4 py-2 font-mono text-sm transition-colors ${
                  !isPublic
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                Private
              </button>
            </div>
          </div>

          {/* Start Time */}
          <div>
            <label className="mb-2 block font-mono text-sm font-medium text-zinc-300">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Question Count */}
          <div>
            <label className="mb-2 block font-mono text-sm font-medium text-zinc-300">
              Number of Questions (2-5)
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQuestionCount(Math.max(2, questionCount - 1))}
                className="rounded-md border border-zinc-700 bg-zinc-800 p-2 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-100 disabled:opacity-50"
                disabled={questionCount <= 2}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-mono text-lg font-semibold text-zinc-100">
                {questionCount}
              </span>
              <button
                type="button"
                onClick={() => setQuestionCount(Math.min(5, questionCount + 1))}
                className="rounded-md border border-zinc-700 bg-zinc-800 p-2 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-100 disabled:opacity-50"
                disabled={questionCount >= 5}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="mb-2 block font-mono text-sm font-medium text-zinc-300">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Global Topics */}
          <div>
            <label className="mb-2 block font-mono text-sm font-medium text-zinc-300">
              Topics (applies to all questions)
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTopic(tag)}
                  className={`rounded-md px-3 py-1 font-mono text-xs transition-colors ${
                    globalTopics.includes(tag)
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Problem Slots */}
          <div>
            <label className="mb-3 block font-mono text-sm font-medium text-zinc-300">
              Problem Configuration
              <span className="ml-2 text-xs text-zinc-500">
                (Problems will be randomly selected)
              </span>
            </label>
            <div className="space-y-3">
              {problemSlots.map((slot, i) => (
                <div
                  key={i}
                  className="rounded-md border border-zinc-700 bg-zinc-800 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-sm font-medium text-zinc-300">
                      Problem {i + 1}
                    </span>
                    <select
                      value={slot.difficulty}
                      onChange={(e) => {
                        const newSlots = [...problemSlots];
                        newSlots[i].difficulty = e.target.value as
                          | "easy"
                          | "medium"
                          | "hard";
                        setProblemSlots(newSlots);
                      }}
                      className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 font-mono text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div className="text-xs text-zinc-500">
                    Topics: {slot.topics.join(", ") || "All"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Friends */}
          {!isPublic && friends.length > 0 && (
            <div>
              <label className="mb-2 block font-mono text-sm font-medium text-zinc-300">
                Invite Friends (Optional)
              </label>
              <div className="max-h-40 overflow-y-auto rounded-md border border-zinc-700 bg-zinc-800 p-2">
                {friends.map((friend) => (
                  <button
                    key={friend.id}
                    type="button"
                    onClick={() => toggleFriend(friend.id)}
                    className={`mb-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors ${
                      selectedFriends.includes(friend.id)
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "text-zinc-400 hover:bg-zinc-700"
                    }`}
                  >
                    <span className="font-mono text-sm">{friend.username}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 py-2 font-mono text-sm text-zinc-300 transition-colors hover:border-zinc-600"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-emerald-600 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Contest"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
