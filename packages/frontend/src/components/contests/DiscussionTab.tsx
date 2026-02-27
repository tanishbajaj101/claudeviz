

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, MessageSquare } from "lucide-react";
import { useChatSocket, useSocketEvent } from "../../hooks/useSocket";
import { getContestStatus, type ContestStatus } from "../../lib/contest-status";
import type { MessageNewPayload } from "../../lib/socket/events";

interface Message {
  id: string;
  senderId: number;
  senderUsername: string;
  content: string;
  createdAt: string;
}

interface DiscussionTabProps {
  contestId: string;
  conversationId: string;
  startsAt: string;
  durationMinutes: number;
  currentUserId?: number;
}

export function DiscussionTab({
  contestId,
  conversationId,
  startsAt,
  durationMinutes,
  currentUserId,
}: DiscussionTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const { socket, isConnected } = useChatSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Recompute contest status periodically so UI updates at boundaries
  const [status, setStatus] = useState<ContestStatus>(() =>
    getContestStatus(startsAt, durationMinutes)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newStatus = getContestStatus(startsAt, durationMinutes);
      setStatus((prev) => {
        if (prev !== newStatus) return newStatus;
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [startsAt, durationMinutes]);

  // Fetch messages
  useEffect(() => {
    if (!conversationId) return;

    fetch(`/api/conversations/${conversationId}/messages?limit=100`)
      .then((res) => res.json())
      .then((data) => {
        const messagesList = data.messages || [];
        setMessages(
          messagesList.map((m: Record<string, unknown>) => ({
            id: m.id as string,
            senderId: (m.sender_id ?? m.senderId) as number,
            senderUsername: (m.sender_username ?? m.senderUsername) as string,
            content: m.content as string,
            createdAt: (m.created_at ?? m.createdAt) as string,
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("[DiscussionTab] Error fetching messages:", err);
        setLoading(false);
      });
  }, [conversationId]);

  // Join conversation room when socket connects
  useEffect(() => {
    if (socket && isConnected && conversationId) {
      // Join the conversation room so we receive message:new broadcasts
      socket.emit("conversation:join", { conversationId }, (result) => {
        if (!result.ok) {
          console.warn("[DiscussionTab] Failed to join conversation room:", result.error);
        }
      });

      return () => {
        socket.emit("conversation:leave", { conversationId }, () => {});
      };
    }
  }, [socket, isConnected, conversationId]);

  // Listen for new messages
  useSocketEvent(socket, "message:new", (payload: unknown) => {
    const data = payload as MessageNewPayload;
    const msg = data.message;
    if (msg.conversationId === conversationId) {
      setMessages((prev) => {
        // Deduplicate: avoid adding if already present (from POST response)
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [
          ...prev,
          {
            id: msg.id,
            senderId: msg.senderId,
            senderUsername: msg.senderUsername,
            content: msg.content,
            createdAt: msg.createdAt,
          },
        ];
      });
    }
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket || !currentUserId) return;

    setSendingMessage(true);

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "text",
          content: messageInput.trim(),
        }),
      });

      if (res.ok) {
        setMessageInput("");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to send message");
      }
    } catch (err) {
      console.error("[DiscussionTab] Error sending message:", err);
      alert("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const canSendMessages = status === "active" && currentUserId;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="flex h-[600px] flex-col rounded-lg border border-zinc-800 bg-zinc-900">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-zinc-600" />
              <p className="mt-4 text-sm text-zinc-400">
                No messages yet. Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = currentUserId && message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isCurrentUser
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-800 text-zinc-100"
                  }`}
                >
                  {!isCurrentUser && (
                    <p className="mb-1 font-mono text-xs text-zinc-400">
                      {message.senderUsername}
                    </p>
                  )}
                  <p className="break-words text-sm">{message.content}</p>
                  <p
                    className={`mt-1 font-mono text-xs ${
                      isCurrentUser ? "text-emerald-200" : "text-zinc-500"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4">
        {status === "upcoming" && (
          <div className="rounded-md bg-zinc-800 p-3 text-center text-sm text-zinc-400">
            Chat will open when the contest begins
          </div>
        )}
        {status === "completed" && (
          <div className="rounded-md bg-zinc-800 p-3 text-center text-sm text-zinc-400">
            Contest has ended. Chat is read-only.
          </div>
        )}
        {status === "active" && (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              disabled={!canSendMessages || sendingMessage}
              className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!canSendMessages || !messageInput.trim() || sendingMessage}
              className="flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
            >
              {sendingMessage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
