/**
 * Rate Limiter Utility
 * Prevents spam submissions by limiting the number of actions within a time window
 */

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

const STORAGE_KEY = "humble_halal_rate_limits";

// Default configurations for different actions
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // Form submissions
  business_submit: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 }, // 3 per hour, block for 30 min
  review_submit: { maxAttempts: 5, windowMs: 60 * 60 * 1000 }, // 5 reviews per hour
  event_submit: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 events per hour
  contact_form: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 per 15 minutes
  claim_request: { maxAttempts: 3, windowMs: 24 * 60 * 60 * 1000 }, // 3 per day
  badge_request: { maxAttempts: 3, windowMs: 24 * 60 * 60 * 1000 }, // 3 per day

  // Auth actions
  login_attempt: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 15 * 60 * 1000 }, // 5 attempts, block 15 min
  password_reset: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  signup: { maxAttempts: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour

  // General actions
  search: { maxAttempts: 30, windowMs: 60 * 1000 }, // 30 searches per minute
  rsvp: { maxAttempts: 20, windowMs: 60 * 60 * 1000 }, // 20 RSVPs per hour
};

function getStoredLimits(): Record<string, RateLimitEntry> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveLimits(limits: Record<string, RateLimitEntry>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(limits));
}

function cleanupExpiredEntries(limits: Record<string, RateLimitEntry>): Record<string, RateLimitEntry> {
  const now = Date.now();
  const cleaned: Record<string, RateLimitEntry> = {};

  for (const [key, entry] of Object.entries(limits)) {
    // Keep entries that are still within their window or block period
    const actionType = key.split("_").slice(0, -1).join("_") || key;
    const config = RATE_LIMIT_CONFIGS[actionType];
    const maxAge = config
      ? Math.max(config.windowMs, config.blockDurationMs || 0)
      : 24 * 60 * 60 * 1000; // Default 24 hours

    if (now - entry.firstAttempt < maxAge) {
      cleaned[key] = entry;
    }
  }

  return cleaned;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // milliseconds until reset
  message?: string;
}

/**
 * Check if an action is allowed based on rate limiting
 */
export function checkRateLimit(
  actionType: string,
  identifier?: string // Optional user identifier or IP-like identifier
): RateLimitResult {
  const config = RATE_LIMIT_CONFIGS[actionType];
  if (!config) {
    // No rate limit configured for this action
    return { allowed: true, remaining: Infinity, resetIn: 0 };
  }

  const key = identifier ? `${actionType}_${identifier}` : actionType;
  const now = Date.now();

  let limits = getStoredLimits();
  limits = cleanupExpiredEntries(limits);

  const entry = limits[key];

  if (!entry) {
    // First attempt
    limits[key] = {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    };
    saveLimits(limits);

    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetIn: config.windowMs,
    };
  }

  const windowStart = now - config.windowMs;

  // Check if we're still in the same window
  if (entry.firstAttempt > windowStart) {
    // Still in the rate limit window
    if (entry.count >= config.maxAttempts) {
      // Rate limited
      const resetIn = entry.firstAttempt + config.windowMs - now;
      const blockUntil = config.blockDurationMs
        ? entry.lastAttempt + config.blockDurationMs
        : entry.firstAttempt + config.windowMs;

      return {
        allowed: false,
        remaining: 0,
        resetIn: Math.max(0, blockUntil - now),
        message: `Too many attempts. Please try again in ${formatTimeRemaining(blockUntil - now)}.`,
      };
    }

    // Increment counter
    limits[key] = {
      ...entry,
      count: entry.count + 1,
      lastAttempt: now,
    };
    saveLimits(limits);

    return {
      allowed: true,
      remaining: config.maxAttempts - entry.count - 1,
      resetIn: entry.firstAttempt + config.windowMs - now,
    };
  }

  // Window has expired, start fresh
  limits[key] = {
    count: 1,
    firstAttempt: now,
    lastAttempt: now,
  };
  saveLimits(limits);

  return {
    allowed: true,
    remaining: config.maxAttempts - 1,
    resetIn: config.windowMs,
  };
}

/**
 * Record a rate limit hit without checking (useful for tracking after successful actions)
 */
export function recordRateLimitHit(actionType: string, identifier?: string): void {
  checkRateLimit(actionType, identifier);
}

/**
 * Reset rate limit for a specific action (e.g., after successful login)
 */
export function resetRateLimit(actionType: string, identifier?: string): void {
  const key = identifier ? `${actionType}_${identifier}` : actionType;
  const limits = getStoredLimits();
  delete limits[key];
  saveLimits(limits);
}

/**
 * Get remaining attempts for an action
 */
export function getRemainingAttempts(actionType: string, identifier?: string): number {
  const config = RATE_LIMIT_CONFIGS[actionType];
  if (!config) return Infinity;

  const key = identifier ? `${actionType}_${identifier}` : actionType;
  const limits = getStoredLimits();
  const entry = limits[key];

  if (!entry) return config.maxAttempts;

  const now = Date.now();
  const windowStart = now - config.windowMs;

  if (entry.firstAttempt <= windowStart) {
    return config.maxAttempts;
  }

  return Math.max(0, config.maxAttempts - entry.count);
}

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "now";

  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""}`;

  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""}`;

  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours !== 1 ? "s" : ""}`;
}

/**
 * React hook for rate limiting
 */
export function useRateLimit(actionType: string, identifier?: string) {
  return {
    check: () => checkRateLimit(actionType, identifier),
    record: () => recordRateLimitHit(actionType, identifier),
    reset: () => resetRateLimit(actionType, identifier),
    getRemaining: () => getRemainingAttempts(actionType, identifier),
  };
}
