

import { useState, useRef, useEffect } from "react";
import { ChatMessage, ProblemContext, VisualizationData } from "../../types";
import { VisualizationRenderer } from "../../components/chat/VisualizationRenderer";

interface ChatPanelProps {
  problemContext: ProblemContext;
  isAuthenticated: boolean;
}

export function ChatPanel({ problemContext, isAuthenticated }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          problemContext,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = (await response.json()) as {
        reply: string;
        visualization?: VisualizationData;
      };

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          visualization: data.visualization,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="font-mono text-sm text-zinc-500">
          Sign in to use the AI coach.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="font-mono text-xs text-zinc-600">
              Ask a question about this problem...
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 font-mono text-sm ${
                msg.role === "user"
                  ? "bg-emerald-600/20 text-emerald-200"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.visualization && (
                <div className="mt-3">
                  <VisualizationRenderer data={msg.visualization} />
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-zinc-800 px-3 py-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask the AI coach..."
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-emerald-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="rounded-md bg-emerald-600 px-4 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
