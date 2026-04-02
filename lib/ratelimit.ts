// lib/ratelimit.ts — Upstash Redis rate limiters (CONTEXT.md §17)
import 'server-only'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function getValidRedisUrl() {
    try {
        const url = process.env.UPSTASH_REDIS_REST_URL
        if (!url) return null
        new URL(url) // Throws if invalid
        return url
    } catch {
        return null
    }
}

const redisUrl = getValidRedisUrl()
const isUpstashConfigured = !!(redisUrl && process.env.UPSTASH_REDIS_REST_TOKEN)

if (!isUpstashConfigured) {
    console.warn('[ratelimit] ⚠ Upstash Redis not configured. Rate limiting is DISABLED. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.')
}

const redis = isUpstashConfigured
    ? new Redis({
        url: redisUrl,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    : ({} as Redis)

const mockLimiter = {
    limit: async () => ({ success: true, limit: 100, remaining: 99, reset: Date.now() + 10000 })
}

/** Contact form: 3 submissions per hour per IP */
export const contactFormLimiter = isUpstashConfigured
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '1 h'),
        prefix: 'rl:contact',
    })
    : mockLimiter

/** CTF flag submission: 10 attempts per minute per member */
export const flagSubmitLimiter = isUpstashConfigured
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 m'),
        prefix: 'rl:ctf',
    })
    : mockLimiter

/** Member registration: 5 attempts per hour per email */
export const registerLimiter = isUpstashConfigured
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1 h'),
        prefix: 'rl:register',
    })
    : mockLimiter

/** Magic link/login request: 3 requests per 15 minutes per email */
export const magicLinkLimiter = isUpstashConfigured
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '15 m'),
        prefix: 'rl:magiclink',
    })
    : mockLimiter
