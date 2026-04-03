

import { useState, useEffect, useMemo } from "react";
import {
  X,
  Plus,
  Minus,
  Loader2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
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

// Compute all unique tags at module level (static data)
const allTags = Array.from(new Set(problems.flatMap((p) => p.tags))).sort();

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const getDifficultyClasses = (
  diff: "easy" | "medium" | "hard",
  isSelected: boolean
) => {
  const base =
    "rounded-full px-3 py-1 font-mono text-xs border transition-all cursor-pointer";
  if (!isSelected)
    return `${base} border-border bg-transparent text-muted-foreground hover:bg-zinc-800`;
  const colors = {
    easy: "border-emerald-500/50 bg-emerald-500/15 text-emerald-400",
    medium: "border-amber-500/50 bg-amber-500/15 text-amber-400",
    hard: "border-red-500/50 bg-red-500/15 text-red-400",
  };
  return `${base} ${colors[diff]}`;
};

export function CreateContestModal({
  onClose,
  onSuccess,
}: CreateContestModalProps) {
  const [title, setTitle] = useState("");
  // Date/time picker state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const now = new Date();
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth());
  const [calendarYear, setCalendarYear] = useState(now.getFullYear());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [questionCount, setQuestionCount] = useState(3);
  const [duration, setDuration] = useState(45);
  const [problemSlots, setProblemSlots] = useState<ProblemSlot[]>([
    { difficulty: "easy", topics: [...allTags] },
    { difficulty: "medium", topics: [...allTags] },
    { difficulty: "hard", topics: [...allTags] },
  ]);
  const [globalTopics, setGlobalTopics] = useState<string[]>([...allTags]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calendar grid computation
  const calendarCells = useMemo(() => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();

    const cells: Array<{
      day: number;
      inCurrentMonth: boolean;
      date: Date;
    }> = [];

    // Previous month trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      cells.push({
        day,
        inCurrentMonth: false,
        date: new Date(calendarYear, calendarMonth - 1, day),
      });
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        inCurrentMonth: true,
        date: new Date(calendarYear, calendarMonth, d),
      });
    }
    // Next month leading days
    let nextDay = 1;
    while (cells.length < 42) {
      cells.push({
        day: nextDay,
        inCurrentMonth: false,
        date: new Date(calendarYear, calendarMonth + 1, nextDay),
      });
      nextDay++;
    }
    return cells;
  }, [calendarMonth, calendarYear]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDatePast = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isToday = (date: Date) => isSameDay(date, new Date());

  const formatSelectedDateTime = () => {
    if (!selectedDate) return null;
    const monthName = MONTH_NAMES[selectedDate.getMonth()].slice(0, 3);
    const day = selectedDate.getDate();
    const year = selectedDate.getFullYear();
    const hour = String(selectedHour).padStart(2, "0");
    const minute = String(selectedMinute).padStart(2, "0");
    return `${monthName} ${day}, ${year} at ${hour}:${minute}`;
  };

  const navigateMonth = (direction: -1 | 1) => {
    let newMonth = calendarMonth + direction;
    let newYear = calendarYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCalendarMonth(newMonth);
    setCalendarYear(newYear);
  };

  useEffect(() => {
    fetch("/api/friends")
      .then((res) => res.json())
      .then((data) => setFriends(data.friends || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setDuration(questionCount * 15);
  }, [questionCount]);

  useEffect(() => {
    const newSlots: ProblemSlot[] = [];
    for (let i = 0; i < questionCount; i++) {
      if (problemSlots[i]) {
        newSlots.push(problemSlots[i]);
      } else {
        const difficulty =
          i % 3 === 0 ? "easy" : i % 3 === 1 ? "medium" : ("hard" as const);
        newSlots.push({ difficulty, topics: [...globalTopics] });
      }
    }
    setProblemSlots(newSlots);
  }, [questionCount]);

  useEffect(() => {
    setProblemSlots((prev) =>
      prev.map((slot) => ({ ...slot, topics: [...globalTopics] }))
    );
  }, [globalTopics]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Contest title is required");
      return;
    }

    if (!selectedDate) {
      setError("Start time is required");
      return;
    }

    const startsAt = new Date(selectedDate);
    startsAt.setHours(selectedHour, selectedMinute, 0, 0);
    if (startsAt <= new Date()) {
      setError("Start time must be in the future");
      return;
    }

    if (globalTopics.length === 0) {
      setError("At least one topic must be selected");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          is_public: false,
          starts_at: startsAt.toISOString(),
          duration_minutes: duration,
          problems: problemSlots.map((slot) => ({
            difficulty: slot.difficulty,
            topics: [...globalTopics],
          })),
          invited_user_ids:
            selectedFriends.length > 0 ? selectedFriends : undefined,
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

  const setDifficulty = (
    index: number,
    difficulty: "easy" | "medium" | "hard"
  ) => {
    setProblemSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, difficulty } : slot))
    );
  };

  const allTopicsSelected = globalTopics.length === allTags.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 font-mono text-2xl font-bold text-foreground">
          Create Contest
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="mb-1.5 block font-mono text-sm font-medium text-muted-foreground">
              Contest Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground focus:border-emerald-500 focus:outline-none"
              placeholder="Weekly Challenge"
            />
          </div>

          {/* Date & Time Picker */}
          <div>
            <label className="mb-1.5 block font-mono text-sm font-medium text-muted-foreground">
              Start Date & Time
            </label>
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left font-mono text-sm transition-colors ${
                showDatePicker
                  ? "border-emerald-500 bg-muted"
                  : "border-border bg-muted hover:border-zinc-600"
              }`}
            >
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {formatSelectedDateTime() ? (
                <span className="text-foreground">
                  {formatSelectedDateTime()}
                </span>
              ) : (
                <span className="text-muted-foreground">
                  Select date & time
                </span>
              )}
            </button>

            {showDatePicker && (
              <div className="mt-2 rounded-md border border-border bg-muted p-4">
                {/* Calendar Header */}
                <div className="mb-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigateMonth(-1)}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-zinc-700 hover:text-foreground"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {MONTH_NAMES[calendarMonth]} {calendarYear}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateMonth(1)}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-zinc-700 hover:text-foreground"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Day-of-week headers */}
                <div className="mb-1 grid grid-cols-7 gap-1">
                  {DAY_LABELS.map((d) => (
                    <div
                      key={d}
                      className="flex h-8 items-center justify-center font-mono text-xs text-muted-foreground"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((cell, idx) => {
                    const past =
                      cell.inCurrentMonth && isDatePast(cell.date);
                    const selected =
                      selectedDate && isSameDay(cell.date, selectedDate);
                    const todayCell =
                      cell.inCurrentMonth && isToday(cell.date);

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!cell.inCurrentMonth || past}
                        onClick={() => {
                          setSelectedDate(cell.date);
                        }}
                        className={`flex h-8 w-full items-center justify-center rounded-md font-mono text-sm transition-all ${
                          !cell.inCurrentMonth
                            ? "cursor-default text-zinc-700"
                            : past
                              ? "cursor-not-allowed text-zinc-700"
                              : selected
                                ? "bg-emerald-500 font-semibold text-white"
                                : todayCell
                                  ? "text-emerald-400 ring-1 ring-emerald-500/50 hover:bg-zinc-700"
                                  : "text-foreground hover:bg-zinc-700"
                        }`}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>

                {/* Time Selector */}
                <div className="mt-3 border-t border-border pt-3">
                  <div className="flex items-center justify-center gap-1">
                    {/* Hour */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedHour((h) => (h + 1) % 24)
                        }
                        className="rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-zinc-700 hover:text-foreground"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <div className="flex h-10 w-12 items-center justify-center rounded-md border border-border bg-card font-mono text-lg text-foreground">
                        {String(selectedHour).padStart(2, "0")}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedHour((h) => (h - 1 + 24) % 24)
                        }
                        className="rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-zinc-700 hover:text-foreground"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>

                    <span className="font-mono text-lg text-muted-foreground">
                      :
                    </span>

                    {/* Minute */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedMinute((m) => (m + 5) % 60)
                        }
                        className="rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-zinc-700 hover:text-foreground"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <div className="flex h-10 w-12 items-center justify-center rounded-md border border-border bg-card font-mono text-lg text-foreground">
                        {String(selectedMinute).padStart(2, "0")}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedMinute((m) => (m - 5 + 60) % 60)
                        }
                        className="rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-zinc-700 hover:text-foreground"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>

                    <span className="ml-2 font-mono text-xs text-muted-foreground">
                      24h
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Questions + Duration side by side */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="mb-1.5 block font-mono text-sm font-medium text-muted-foreground">
                Questions (2-5)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setQuestionCount(Math.max(2, questionCount - 1))
                  }
                  className="rounded-md border border-border bg-muted p-2 text-muted-foreground transition-colors hover:border-zinc-600 hover:text-foreground disabled:opacity-50"
                  disabled={questionCount <= 2}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-mono text-lg font-semibold text-foreground">
                  {questionCount}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuestionCount(Math.min(5, questionCount + 1))
                  }
                  className="rounded-md border border-border bg-muted p-2 text-muted-foreground transition-colors hover:border-zinc-600 hover:text-foreground disabled:opacity-50"
                  disabled={questionCount >= 5}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block font-mono text-sm font-medium text-muted-foreground">
                Duration (min)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) =>
                  setDuration(Math.max(1, parseInt(e.target.value) || 1))
                }
                min="1"
                className="w-full rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Topics */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="font-mono text-sm font-medium text-muted-foreground">
                Topics
              </label>
              <button
                type="button"
                onClick={() =>
                  setGlobalTopics(allTopicsSelected ? [] : [...allTags])
                }
                className="font-mono text-xs text-emerald-400 transition-colors hover:text-emerald-300"
              >
                {allTopicsSelected ? "Clear All" : "Select All"}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTopic(tag)}
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-xs transition-colors ${
                    globalTopics.includes(tag)
                      ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                      : "border-border bg-transparent text-muted-foreground/60 hover:bg-zinc-800"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Problem Configuration */}
          <div>
            <label className="mb-2 block font-mono text-sm font-medium text-muted-foreground">
              Problem Configuration
              <span className="ml-2 text-xs text-muted-foreground/60">
                (randomly selected)
              </span>
            </label>
            <div className="space-y-2">
              {problemSlots.map((slot, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border border-border bg-muted px-3 py-2.5"
                >
                  <span className="font-mono text-sm text-muted-foreground">
                    Problem {i + 1}
                  </span>
                  <div className="flex gap-1.5">
                    {(["easy", "medium", "hard"] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDifficulty(i, d)}
                        className={getDifficultyClasses(
                          d,
                          slot.difficulty === d
                        )}
                      >
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Friends */}
          {friends.length > 0 && (
            <div>
              <label className="mb-1.5 block font-mono text-sm font-medium text-muted-foreground">
                Invite Friends
              </label>
              <div className="max-h-40 overflow-y-auto rounded-md border border-border bg-muted p-2">
                {friends.map((friend) => (
                  <button
                    key={friend.id}
                    type="button"
                    onClick={() => toggleFriend(friend.id)}
                    className={`mb-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors ${
                      selectedFriends.includes(friend.id)
                        ? "bg-primary/20 text-emerald-400"
                        : "text-muted-foreground hover:bg-zinc-700"
                    }`}
                  >
                    <span className="font-mono text-sm">
                      {friend.username}
                    </span>
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
              className="flex-1 rounded-md border border-border bg-muted py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-zinc-600"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-primary disabled:opacity-50"
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
