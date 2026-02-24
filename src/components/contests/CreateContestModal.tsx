"use client";

import { useState } from "react";
import { X, Calendar, Clock, Lock, Globe } from "lucide-react";

interface CreateContestModalProps {
    onClose: () => void;
    onSuccess: (contest: any) => void;
}

export function CreateContestModal({ onClose, onSuccess }: CreateContestModalProps) {
    const [title, setTitle] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("60");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!title || !date || !time || !duration) {
                throw new Error("Please fill out all fields.");
            }

            // Combine date and time
            const startDateTime = new Date(`${date}T${time}`).toISOString();

      const res = await fetch("/api/contests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          isPublic,
          duration_minutes: parseInt(duration, 10),
          starts_at: startDateTime,
          // Generate 3 random questions by asking the backend for a mix
          topics: [],
          questions: [
            { difficulty: "easy" },
            { difficulty: "medium" },
            { difficulty: "hard" }
          ]
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create contest");

      onSuccess(data.contest);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="font-mono text-xl font-bold text-zinc-100">Create New Contest</h2>
          <button 
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            
            {error && (
              <div className="rounded-md bg-red-500/10 p-3 text-sm font-medium text-red-500 border border-red-500/20">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">Contest Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weekly Speedrun Arena"
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Start Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 pl-10 pr-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Start Time</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 pl-10 pr-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">Duration (Minutes)</label>
              <select 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="30">30 Minutes (Sprint)</option>
                <option value="60">60 Minutes (Standard)</option>
                <option value="90">90 Minutes (Endurance)</option>
                <option value="120">120 Minutes (Marathon)</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Privacy Setting</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`flex items-center gap-3 rounded-md border p-3 text-left transition-colors ${isPublic ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'}`}
                >
                  <Globe size={18} className={isPublic ? 'text-emerald-400' : 'text-zinc-500'} />
                  <div>
                    <div className={`font-medium text-sm ${isPublic ? 'text-emerald-400' : 'text-zinc-300'}`}>Public</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Visible to everyone in the arenas tab</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`flex items-center gap-3 rounded-md border p-3 text-left transition-colors ${!isPublic ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'}`}
                >
                  <Lock size={18} className={!isPublic ? 'text-amber-400' : 'text-zinc-500'} />
                  <div>
                    <div className={`font-medium text-sm ${!isPublic ? 'text-amber-400' : 'text-zinc-300'}`}>Invite Only</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Hidden, join via link or direct invite</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Note about auto-generated problems */}
            <div className="rounded-md border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-400 flex items-start gap-2">
              <span className="text-zinc-500 flex-shrink-0">ⓘ</span>
              <span>This contest will automatically generate 3 problems (Easy, Medium, Hard) from the global problem bank to prevent cheating/pre-solving.</span>
            </div>

          </div>

          <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button 
              type="button" 
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? "Creating..." : "Create Contest"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
