import { useEffect, useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SessionTimeoutOptions {
  timeoutMs?: number; // Time until session expires (default: 30 minutes)
  warningMs?: number; // Time before timeout to show warning (default: 5 minutes)
  onTimeout?: () => void; // Callback when session times out
  onWarning?: (remainingMs: number) => void; // Callback when warning period starts
  enabled?: boolean; // Whether to enable session timeout
}

const DEFAULT_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const DEFAULT_WARNING_MS = 5 * 60 * 1000; // 5 minutes
const ACTIVITY_EVENTS = [
  "mousedown",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];
const LAST_ACTIVITY_KEY = "humble_halal_last_activity";

export function useSessionTimeout(options: SessionTimeoutOptions = {}) {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    warningMs = DEFAULT_WARNING_MS,
    onTimeout,
    onWarning,
    enabled = true,
  } = options;

  const [isWarning, setIsWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(timeoutMs);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
      warningRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleTimeout = useCallback(async () => {
    clearTimers();
    setIsWarning(false);

    // Sign out the user
    try {
      await supabase.auth.signOut();
      toast.info("You've been signed out due to inactivity", {
        duration: 5000,
      });
      onTimeout?.();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [clearTimers, onTimeout]);

  const handleWarning = useCallback(() => {
    setIsWarning(true);
    const warningStartTime = Date.now();

    // Start countdown
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - warningStartTime;
      const remaining = warningMs - elapsed;
      setRemainingTime(Math.max(0, remaining));

      if (remaining <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, 1000);

    onWarning?.(warningMs);
  }, [warningMs, onWarning]);

  const resetTimer = useCallback(() => {
    if (!enabled) return;

    clearTimers();
    setIsWarning(false);
    setRemainingTime(timeoutMs);

    // Store last activity time
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());

    // Set warning timer
    warningRef.current = setTimeout(handleWarning, timeoutMs - warningMs);

    // Set timeout timer
    timeoutRef.current = setTimeout(handleTimeout, timeoutMs);
  }, [enabled, clearTimers, timeoutMs, warningMs, handleWarning, handleTimeout]);

  const extendSession = useCallback(() => {
    resetTimer();
    setIsWarning(false);
    toast.success("Session extended");
  }, [resetTimer]);

  // Check for stored last activity on mount
  useEffect(() => {
    if (!enabled) return;

    const storedLastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (storedLastActivity) {
      const lastActivity = parseInt(storedLastActivity, 10);
      const elapsed = Date.now() - lastActivity;

      if (elapsed >= timeoutMs) {
        // Session already expired
        handleTimeout();
        return;
      }

      if (elapsed >= timeoutMs - warningMs) {
        // In warning period
        handleWarning();
        const remainingTimeout = timeoutMs - elapsed;
        timeoutRef.current = setTimeout(handleTimeout, remainingTimeout);
        return;
      }
    }

    // Start fresh timer
    resetTimer();
  }, [enabled, timeoutMs, warningMs, resetTimer, handleTimeout, handleWarning]);

  // Set up activity listeners
  useEffect(() => {
    if (!enabled) return;

    const handleActivity = () => {
      if (!isWarning) {
        resetTimer();
      }
    };

    // Add event listeners
    ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup
    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      clearTimers();
    };
  }, [enabled, isWarning, resetTimer, clearTimers]);

  // Listen for visibility changes
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Check if session expired while tab was hidden
        const storedLastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
        if (storedLastActivity) {
          const lastActivity = parseInt(storedLastActivity, 10);
          const elapsed = Date.now() - lastActivity;

          if (elapsed >= timeoutMs) {
            handleTimeout();
          } else if (!isWarning) {
            resetTimer();
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, timeoutMs, isWarning, resetTimer, handleTimeout]);

  return {
    isWarning,
    remainingTime,
    extendSession,
    resetTimer,
  };
}

// Helper function to format remaining time
export function formatRemainingTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  return `${seconds}s`;
}
