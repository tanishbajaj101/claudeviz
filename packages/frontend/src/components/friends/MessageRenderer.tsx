

import { Link } from "react-router-dom";
import type { MessagePayload } from "../../lib/socket/events";
import { useAuth } from "../../contexts/AuthContext";
import { ExternalLink, Code, Trophy } from "lucide-react";

interface MessageRendererProps {
    message: MessagePayload;
}

function difficultyColor(diff: string) {
    switch (diff?.toLowerCase()) {
        case "easy": return "text-emerald-400";
        case "medium": return "text-yellow-400";
        case "hard": return "text-red-400";
        default: return "text-muted-foreground";
    }
}

export function MessageRenderer({ message }: MessageRendererProps) {
    const { user } = useAuth();
    const isSelf = message.senderId === user?.id;

    if (message.type === "text") {
        return (
            <div className={`flex ${isSelf ? "justify-end" : "justify-start"} mb-2`}>
                <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${isSelf
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                        }`}
                >
                    {!isSelf && (
                        <p className="mb-1 text-xs font-semibold text-emerald-400">
                            {message.senderUsername}
                        </p>
                    )}
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <p className={`mt-1 text-right text-[10px] ${isSelf ? "text-emerald-200/70" : "text-muted-foreground"}`}>
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>
            </div>
        );
    }

    if (message.type === "problem_recommendation") {
        const meta = (message.metadata ?? {}) as {
            problem_id?: string;
            problem_name?: string;
            difficulty?: string;
            note?: string;
        };
        return (
            <div className="mb-2 flex justify-start">
                <div className="max-w-[80%] rounded-xl border border-border bg-card p-3 text-sm">
                    <p className="mb-1 text-xs font-semibold text-emerald-400">{message.senderUsername}</p>
                    <div className="mb-2 flex items-center gap-2">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wide font-mono">Problem Recommendation</span>
                    </div>
                    {meta.problem_id ? (
                        <Link
                            to={`/problems/${meta.problem_id}`}
                            className="font-semibold text-foreground hover:text-emerald-400 transition-colors"
                        >
                            {meta.problem_name ?? meta.problem_id}
                        </Link>
                    ) : (
                        <p className="font-semibold text-foreground">{meta.problem_name}</p>
                    )}
                    {meta.difficulty && (
                        <span className={`mt-1 inline-block text-xs font-mono ${difficultyColor(meta.difficulty)}`}>
                            {meta.difficulty}
                        </span>
                    )}
                    {meta.note && <p className="mt-2 text-xs text-muted-foreground">{meta.note}</p>}
                    <p className="mt-2 text-right text-[10px] text-muted-foreground">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>
            </div>
        );
    }

    if (message.type === "code_snippet") {
        const meta = (message.metadata ?? {}) as {
            language?: string;
            code?: string;
        };
        return (
            <div className="mb-2 flex justify-start">
                <div className="max-w-[90%] rounded-xl border border-border bg-card p-3 text-sm w-full">
                    <p className="mb-1 text-xs font-semibold text-emerald-400">{message.senderUsername}</p>
                    <div className="mb-2 flex items-center gap-2">
                        <Code className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wide font-mono">
                            {meta.language ?? "Code"}
                        </span>
                    </div>
                    {meta.code && (
                        <pre className="overflow-x-auto rounded-lg bg-background border border-border/50 p-3 text-xs font-mono text-foreground whitespace-pre leading-relaxed">
                            <code>{meta.code}</code>
                        </pre>
                    )}
                    <p className="mt-2 text-right text-[10px] text-muted-foreground">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>
            </div>
        );
    }

    if (message.type === "contest_invite") {
        const meta = (message.metadata ?? {}) as {
            contest_id?: string;
            contest_name?: string;
            start_time?: string;
        };
        return (
            <div className="mb-2 flex justify-start">
                <div className="max-w-[80%] rounded-xl border border-border bg-card p-3 text-sm">
                    <p className="mb-1 text-xs font-semibold text-emerald-400">{message.senderUsername}</p>
                    <div className="mb-2 flex items-center gap-2">
                        <Trophy className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wide font-mono">Contest Invite</span>
                    </div>
                    <p className="font-semibold text-foreground">{meta.contest_name ?? "Contest"}</p>
                    {meta.start_time && (
                        <p className="mt-1 text-xs text-muted-foreground">
                            Starts: {new Date(meta.start_time).toLocaleString()}
                        </p>
                    )}
                    {meta.contest_id && (
                        <Link
                            to={`/contests/${meta.contest_id}`}
                            className="mt-3 inline-block rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary transition-colors"
                        >
                            Join Contest
                        </Link>
                    )}
                    <p className="mt-2 text-right text-[10px] text-muted-foreground">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>
            </div>
        );
    }

    return null;
}
