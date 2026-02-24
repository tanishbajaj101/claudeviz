"use client";

import { useState } from "react";
import { X, Search, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useFriends } from "@/hooks/useFriends";
import { Problem } from "@/types";

interface RecommendModalProps {
    problem: Problem;
    currentUserId: number;
    onClose: () => void;
}

export function RecommendModal({ problem, currentUserId, onClose }: RecommendModalProps) {
    const { friends, onlineFriends } = useFriends(currentUserId);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFriends, setSelectedFriends] = useState<Set<number>>(new Set());
    const [note, setNote] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const filteredFriends = friends.filter(f =>
        f.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFriend = (id: number) => {
        setSelectedFriends(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSend = async () => {
        if (selectedFriends.size === 0) return;

        setSending(true);
        setError(null);

        try {
            const promises = Array.from(selectedFriends).map(friendId =>
                fetch("/api/chat/messages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        recipient_id: friendId,
                        type: "problem_recommendation",
                        content: note, // we will put the note in the content field.
                        metadata: {
                            problem_id: problem.id,
                            problem_name: problem.title,
                            difficulty: problem.difficulty,
                            note: note
                        }
                    })
                }).then(res => {
                    if (!res.ok) throw new Error("Failed to send some recommendations");
                    return res.json();
                })
            );

            await Promise.all(promises);

            setSuccess(true);
            setTimeout(() => {
                onClose();
                // Assuming there is a global toast system, we could trigger it here.
                // For now, the inline success state + auto-close handles it.
            }, 1500);

        } catch (err: any) {
            setError(err.message || "Failed to recommend problem");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                    <h2 className="font-mono text-lg font-bold text-zinc-100">Recommend to a Friend</h2>
                    <button
                        onClick={onClose}
                        className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-4">

                    <div className="text-sm text-zinc-400">
                        Recommending: <span className="font-medium text-zinc-200">{problem.title}</span>
                    </div>

                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search friends..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900 pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                        />
                    </div>

                    <div className="h-48 overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900/50">
                        {friends.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                                You don't have any friends yet.
                            </div>
                        ) : filteredFriends.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                                No friends found.
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-800 border-t border-zinc-800">
                                {filteredFriends.map(friend => {
                                    const isOnline = onlineFriends.has(friend.id);
                                    const isSelected = selectedFriends.has(friend.id);

                                    return (
                                        <button
                                            key={friend.id}
                                            onClick={() => toggleFriend(friend.id)}
                                            className={`w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800 transition-colors ${isSelected ? 'bg-emerald-500/5' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <img
                                                        src={`/api/users/avatar?username=${friend.username}`}
                                                        alt={friend.username}
                                                        className="h-8 w-8 rounded-full bg-zinc-800"
                                                    />
                                                    <div className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 ${isOnline ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
                                                </div>
                                                <div className="text-left flex flex-col">
                                                    <span className="text-sm font-medium text-zinc-200">{friend.name}</span>
                                                    <span className="text-xs text-zinc-500">@{friend.username}</span>
                                                </div>
                                            </div>
                                            <div className={`flex h-5 w-5 items-center justify-center rounded border ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-700 bg-zinc-900'}`}>
                                                {isSelected && <CheckCircle2 size={12} className="text-zinc-950" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div>
                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder="Add a note... (optional)"
                            maxLength={140}
                            className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                            rows={2}
                        />
                        <div className="mt-1 text-right text-xs text-zinc-500">
                            {note.length}/140
                        </div>
                    </div>

                    {error && <div className="text-sm text-red-500">{error}</div>}

                    {success ? (
                        <div className="flex items-center justify-center gap-2 rounded-md bg-emerald-500/10 py-2.5 text-emerald-400 font-medium text-sm">
                            <CheckCircle2 size={18} /> Recommended to {selectedFriends.size} friend(s)!
                        </div>
                    ) : (
                        <button
                            onClick={handleSend}
                            disabled={selectedFriends.size === 0 || sending}
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                        >
                            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            Send Recommendation
                        </button>
                    )}

                </div>
            </div >
        </div >
    );
}
