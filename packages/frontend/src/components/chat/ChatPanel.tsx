

import { useState, useRef, useEffect } from "react";
import { ChatMessage, ProblemContext, VisualizationData } from "../../types";
import { VisualizationRenderer } from "../../components/chat/VisualizationRenderer";
import { saveChatHistory, loadChatHistory } from "../../lib/chat-storage";
import { API_BASE_URL } from "../../lib/api-client";

interface ChatPanelProps {
  problemId: string;
  problemContext: ProblemContext;
  isAuthenticated: boolean;
}

export function ChatPanel({ problemId, problemContext, isAuthenticated }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hydrate messages from localStorage on mount
  useEffect(() => {
    const storedMessages = loadChatHistory(problemId);
    if (storedMessages) {
      setMessages(storedMessages);
    }
  }, [problemId]);

  // Persist messages to localStorage whenever a non-streaming message is added/updated
  useEffect(() => {
    if (messages.length > 0 && !messages[messages.length - 1].streaming) {
      saveChatHistory(problemId, messages);
    }
  }, [messages, problemId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isStreaming = messages.length > 0 && messages[messages.length - 1].streaming === true;

  async function handleSend() {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput("");

    const history = messages.slice(-10).map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "assistant", content: "", streaming: true },
    ]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, problemContext, history }),
        credentials: "include",
      });

      if (!response.ok || !response.body) {
        throw new Error("Chat request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const updateLast = (updater: (msg: ChatMessage) => ChatMessage) => {
        setMessages((prev) => {
          const msgs = [...prev];
          msgs[msgs.length - 1] = updater(msgs[msgs.length - 1]);
          return msgs;
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop()!;

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          let event: { type: string; chunk?: string; text?: string; data?: VisualizationData; message?: string };
          try {
            event = JSON.parse(line.slice(6));
          } catch {
            continue;
          }

          if (event.type === "text" && event.chunk) {
            updateLast((msg) => {
              const newContent = msg.content + event.chunk!;
              const hasVizRequest = newContent.includes("```vizrequest");
              // Strip the vizrequest block and everything after it from display
              const displayContent = hasVizRequest
                ? newContent.slice(0, newContent.indexOf("```vizrequest")).trimEnd()
                : newContent;
              return { ...msg, content: displayContent, loadingViz: hasVizRequest };
            });
          } else if (event.type === "replace" && event.text !== undefined) {
            updateLast((msg) => ({ ...msg, content: event.text!, loadingViz: false }));
          } else if (event.type === "visualization" && event.data) {
            updateLast((msg) => ({ ...msg, visualization: event.data }));
          } else if (event.type === "done") {
            updateLast((msg) => ({ ...msg, streaming: false }));
          } else if (event.type === "error") {
            updateLast((msg) => ({
              ...msg,
              content: msg.content || "Sorry, something went wrong. Please try again.",
              streaming: false,
            }));
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const msgs = [...prev];
        msgs[msgs.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          streaming: false,
        };
        return msgs;
      });
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="font-mono text-sm text-muted-foreground">
          Sign in to use the AI coach.
        </p>
      </div>
    );
  }

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem(`algoarena-chat-${problemId}`);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <h3 className="font-mono text-sm font-semibold text-muted-foreground">AI Coach</h3>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="font-mono text-xs text-muted-foreground hover:text-muted-foreground transition-colors"
            title="Clear chat history"
          >
            Clear Chat
          </button>
        )}
      </div>

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
                  ? "bg-primary/20 text-emerald-200"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {msg.content || msg.streaming ? (
                <div className="whitespace-pre-wrap">
                  {msg.content}
                  {msg.streaming && !msg.content && !msg.loadingViz && (
                    <div className="flex gap-1 py-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}
                  {msg.loadingViz && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "150ms" }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="font-mono text-xs text-emerald-400">loading visualization...</span>
                    </div>
                  )}
                </div>
              ) : null}
              {msg.visualization && (
                <div className="mt-3">
                  <VisualizationRenderer data={msg.visualization} />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask the AI coach..."
            className="flex-1 rounded-md border border-border bg-card px-3 py-2 font-mono text-sm text-foreground placeholder-zinc-500 outline-none focus:border-emerald-500"
            disabled={isStreaming}
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            className="rounded-md bg-primary px-4 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
