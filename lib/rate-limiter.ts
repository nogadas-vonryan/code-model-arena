import { RateLimitInfo } from "@/types/api";

const MAX_REQUESTS = 10;
const WINDOW_MS = 10 * 60 * 1000;

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();

  check(identifier: string): RateLimitInfo {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      const resetTime = now + WINDOW_MS;
      this.requests.set(identifier, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: MAX_REQUESTS - 1,
        resetTime,
      };
    }

    if (entry.count >= MAX_REQUESTS) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    entry.count += 1;
    return {
      allowed: true,
      remaining: MAX_REQUESTS - entry.count,
      resetTime: entry.resetTime,
    };
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

const rateLimiter = new RateLimiter();

setInterval(() => rateLimiter.cleanup(), 60 * 1000);

export function checkRateLimit(identifier: string): RateLimitInfo {
  return rateLimiter.check(identifier);
}

export { RateLimiter };
