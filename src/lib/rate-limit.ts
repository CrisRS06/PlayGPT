/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or Upstash
 */

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per window
}

interface RateLimitRecord {
  count: number
  resetTime: number
}

class RateLimiter {
  private cache: Map<string, RateLimitRecord> = new Map()
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
    // Cleanup old entries every minute
    setInterval(() => this.cleanup(), 60000)
  }

  async check(identifier: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const now = Date.now()
    const record = this.cache.get(identifier)

    if (!record || now > record.resetTime) {
      // New window or expired window
      const newRecord: RateLimitRecord = {
        count: 1,
        resetTime: now + this.config.interval,
      }
      this.cache.set(identifier, newRecord)

      return {
        success: true,
        limit: this.config.uniqueTokenPerInterval,
        remaining: this.config.uniqueTokenPerInterval - 1,
        reset: newRecord.resetTime,
      }
    }

    // Existing window
    if (record.count >= this.config.uniqueTokenPerInterval) {
      return {
        success: false,
        limit: this.config.uniqueTokenPerInterval,
        remaining: 0,
        reset: record.resetTime,
      }
    }

    // Increment count
    record.count++
    this.cache.set(identifier, record)

    return {
      success: true,
      limit: this.config.uniqueTokenPerInterval,
      remaining: this.config.uniqueTokenPerInterval - record.count,
      reset: record.resetTime,
    }
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, record] of this.cache.entries()) {
      if (now > record.resetTime) {
        this.cache.delete(key)
      }
    }
  }
}

// Rate limiters for different endpoints
export const chatRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 20, // 20 requests per minute
})

export const quizGenerationRateLimiter = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 10, // 10 quiz generations per hour
})

export const quizSubmissionRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 5, // 5 submissions per minute
})

/**
 * Get identifier for rate limiting
 * Uses user ID if authenticated, falls back to IP
 */
export function getRateLimitIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`
  }

  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'

  return `ip:${ip}`
}

/**
 * Helper to add rate limit headers to response
 */
export function addRateLimitHeaders(
  headers: Headers,
  result: { limit: number; remaining: number; reset: number }
) {
  headers.set('X-RateLimit-Limit', result.limit.toString())
  headers.set('X-RateLimit-Remaining', result.remaining.toString())
  headers.set('X-RateLimit-Reset', new Date(result.reset).toISOString())
}

/**
 * Create a rate-limited response
 */
export function createRateLimitResponse(result: { limit: number; remaining: number; reset: number }) {
  const retryAfter = Math.ceil((result.reset - Date.now()) / 1000)

  return new Response(
    JSON.stringify({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(result.reset).toISOString(),
      },
    }
  )
}
