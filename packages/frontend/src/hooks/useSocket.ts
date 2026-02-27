

/**
 * useSocket — client-side Socket.IO hook for AlgoArena.
 *
 * Connects to one of the three typed namespaces, handles reconnection,
 * and auto-disconnects on unmount.
 *
 * Usage:
 *   const { socket, isConnected, emit, on, off } = useSocket("/notifications");
 *
 * The hook reads the NextAuth session via useAuth(). The socket is not
 * created until the session is fully loaded. When the session ends the
 * socket disconnects automatically.
 *
 * Import path: @/hooks/useSocket
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import type {
  ChatServerToClientEvents,
  ChatClientToServerEvents,
  ContestServerToClientEvents,
  ContestClientToServerEvents,
  NotificationServerToClientEvents,
  NotificationClientToServerEvents,
} from "@shared/types/socket";

// ---------------------------------------------------------------------------
// Namespace → typed socket map
// ---------------------------------------------------------------------------

type NamespaceSocketMap = {
  "/chat": Socket<ChatServerToClientEvents, ChatClientToServerEvents>;
  "/contests": Socket<ContestServerToClientEvents, ContestClientToServerEvents>;
  "/notifications": Socket<
    NotificationServerToClientEvents,
    NotificationClientToServerEvents
  >;
};

export type SocketNamespace = keyof NamespaceSocketMap;

// ---------------------------------------------------------------------------
// Connection status
// ---------------------------------------------------------------------------

export type SocketStatus =
  | "idle"         // hook mounted, session not yet ready
  | "connecting"   // io() called, waiting for connect event
  | "connected"    // socket.connected === true
  | "disconnected" // lost connection, Socket.IO will attempt to reconnect
  | "error";       // auth or fatal error, will NOT auto-reconnect

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export interface UseSocketReturn<TNamespace extends SocketNamespace> {
  /** The raw Socket.IO socket for the namespace. Null until connected. */
  socket: NamespaceSocketMap[TNamespace] | null;
  /** Current connection status. */
  status: SocketStatus;
  /** True only when status === "connected". */
  isConnected: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Connect to a Socket.IO namespace and return the typed socket.
 *
 * @param namespace   One of "/chat", "/contests", "/notifications".
 */
export function useSocket<TNamespace extends SocketNamespace>(
  namespace: TNamespace
): UseSocketReturn<TNamespace> {
  const { user, loading } = useAuth();

  // We store the raw socket as a ref to avoid unnecessary re-renders when
  // the socket object itself hasn't changed.
  const socketRef = useRef<Socket | null>(null);

  // We keep a separate React state for the typed socket so that components
  // that destructure `socket` re-render when it is first created/destroyed.
  const [typedSocket, setTypedSocket] =
    useState<NamespaceSocketMap[TNamespace] | null>(null);

  const [status, setStatus] = useState<SocketStatus>("idle");

  useEffect(() => {
    // Wait for the session to resolve before connecting
    if (loading) return;

    // No valid session — disconnect if a socket exists and bail out
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setTypedSocket(null);
        setStatus("idle");
      }
      return;
    }

    // Session available and no existing socket — connect
    if (socketRef.current) return;

    setStatus("connecting");

    // NEXT_PUBLIC_SOCKET_URL should be set in .env.local for production.
    // In development it defaults to the same origin (empty string → same host).
    const socketUrl = import.meta.env.VITE_SOCKET_URL ?? "";

    const socket = io(`${socketUrl}${namespace}`, {
      withCredentials: true,         // forward session cookies same-origin
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      randomizationFactor: 0.5,
    });

    socketRef.current = socket;
    setTypedSocket(socket as unknown as NamespaceSocketMap[TNamespace]);

    socket.on("connect", () => {
      console.log(`[useSocket] connected to ${namespace} (id=${socket.id})`);
      setStatus("connected");
    });

    socket.on("disconnect", (reason) => {
      console.log(
        `[useSocket] disconnected from ${namespace} (reason=${reason})`
      );
      // "io server disconnect" means the server intentionally closed it (auth
      // failure after initial connect, etc.) — do not retry automatically.
      setStatus(
        reason === "io server disconnect" ? "error" : "disconnected"
      );
    });

    socket.on("connect_error", (err) => {
      console.error(
        `[useSocket] connect_error on ${namespace}: ${err.message}`
      );
      if (err.message === "Unauthorized") {
        socket.disconnect();
        setStatus("error");
      } else {
        setStatus("disconnected");
      }
    });

    socket.on("reconnect", (attempt) => {
      console.log(
        `[useSocket] reconnected to ${namespace} after ${attempt} attempt(s)`
      );
      setStatus("connected");
    });

    socket.on("reconnect_failed", () => {
      console.error(
        `[useSocket] reconnect_failed on ${namespace} — giving up`
      );
      setStatus("error");
    });

    return () => {
      console.log(`[useSocket] cleanup socket for ${namespace}`);
      socket.disconnect();
      socketRef.current = null;
      setTypedSocket(null);
      setStatus("idle");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace, loading, user]);

  return {
    socket: typedSocket,
    status,
    isConnected: status === "connected",
  };
}

// ---------------------------------------------------------------------------
// Convenience hook aliases
// ---------------------------------------------------------------------------

export function useChatSocket() {
  return useSocket("/chat");
}

export function useContestSocket() {
  return useSocket("/contests");
}

export function useNotificationSocket() {
  return useSocket("/notifications");
}

// ---------------------------------------------------------------------------
// useSocketEvent — subscribe to a single event with auto-cleanup
// ---------------------------------------------------------------------------

/**
 * Subscribe to a Socket.IO server event with automatic cleanup on unmount
 * or when the socket / handler reference changes.
 *
 * Usage:
 *   const { socket } = useSocket("/notifications");
 *   useSocketEvent(socket, "notification:new", (payload) => { ... });
 */
export function useSocketEvent(
  socket: Socket | null,
  event: string,
  handler: (...args: unknown[]) => void
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!socket) return;

    const stableHandler = (...args: unknown[]) => {
      handlerRef.current(...args);
    };

    socket.on(event, stableHandler);

    return () => {
      socket.off(event, stableHandler);
    };
  }, [socket, event]);
}
