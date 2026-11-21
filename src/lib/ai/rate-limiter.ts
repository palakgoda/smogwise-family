interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTimeSeconds: number;
}

// In-memory sliding-window store: maps IP to array of request timestamps
const slidingWindowMap = new Map<string, number[]>();

/**
 * In-memory sliding-window rate limiter.
 * Default: 15 requests per 10 minutes (600,000 ms) per IP.
 */
export function checkRateLimit(
  ip: string,
  limit = 15,
  windowMs = 10 * 60 * 1000 // 10 minutes
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  const existingTimestamps = slidingWindowMap.get(ip) || [];
  // Keep only timestamps within the current sliding window
  const activeTimestamps = existingTimestamps.filter((ts) => ts > cutoff);

  if (activeTimestamps.length >= limit) {
    const oldest = activeTimestamps[0];
    const resetTimeSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    slidingWindowMap.set(ip, activeTimestamps);
    return {
      allowed: false,
      remaining: 0,
      resetTimeSeconds,
    };
  }

  activeTimestamps.push(now);
  slidingWindowMap.set(ip, activeTimestamps);

  const resetTimeSeconds = Math.ceil(windowMs / 1000);
  return {
    allowed: true,
    remaining: limit - activeTimestamps.length,
    resetTimeSeconds,
  };
}

/**
 * Resets the rate limiter store (primarily used in automated unit tests).
 */
export function resetRateLimits(): void {
  slidingWindowMap.clear();
}
