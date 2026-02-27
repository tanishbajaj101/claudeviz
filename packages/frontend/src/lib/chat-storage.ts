import { ChatMessage } from "../types";

interface StoredChatData {
  messages: ChatMessage[];
  expiresAt: number; // Unix timestamp (ms)
  problemId: string;
}

const STORAGE_KEY_PREFIX = "algoarena-chat-";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Save chat messages with 24-hour expiry
 */
export function saveChatHistory(problemId: string, messages: ChatMessage[]): void {
  try {
    const data: StoredChatData = {
      messages,
      expiresAt: Date.now() + TTL_MS,
      problemId,
    };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${problemId}`, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save chat history:", error);
  }
}

/**
 * Load chat messages (returns null if expired or not found)
 */
export function loadChatHistory(problemId: string): ChatMessage[] | null {
  try {
    const key = `${STORAGE_KEY_PREFIX}${problemId}`;
    const stored = localStorage.getItem(key);

    if (!stored) {
      return null;
    }

    const data: StoredChatData = JSON.parse(stored);

    // Check if expired
    if (Date.now() > data.expiresAt) {
      // Auto-cleanup expired data
      localStorage.removeItem(key);
      return null;
    }

    // Validate problemId matches
    if (data.problemId !== problemId) {
      console.warn("Problem ID mismatch in stored chat data");
      localStorage.removeItem(key);
      return null;
    }

    return data.messages;
  } catch (error) {
    console.error("Failed to load chat history:", error);
    return null;
  }
}

/**
 * Cleanup all expired chats from localStorage
 */
export function clearExpiredChats(): void {
  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const data: StoredChatData = JSON.parse(stored);
            if (Date.now() > data.expiresAt) {
              keysToRemove.push(key);
            }
          }
        } catch {
          // If parsing fails, mark for removal
          keysToRemove.push(key);
        }
      }
    }

    // Remove expired entries
    keysToRemove.forEach(key => localStorage.removeItem(key));

    if (keysToRemove.length > 0) {
      console.log(`Cleaned up ${keysToRemove.length} expired chat(s)`);
    }
  } catch (error) {
    console.error("Failed to clear expired chats:", error);
  }
}
