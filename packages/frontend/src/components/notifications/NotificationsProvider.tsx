

import { ReactNode } from "react";

/**
 * NotificationsProvider — Lightweight wrapper for notification context.
 *
 * Toast rendering has been moved to ToastNotifications.tsx (Phase 11)
 * which listens to Socket.IO events directly. This provider is kept
 * as a structural wrapper to avoid breaking the component tree in
 * Providers.tsx, but no longer registers duplicate socket listeners.
 */
export function NotificationsProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
