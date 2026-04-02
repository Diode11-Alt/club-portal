// __tests__/ratelimit.test.ts — Rate limiter configuration tests
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock server-only before any imports
vi.mock('server-only', () => ({}))

// Mock Upstash with NO env vars configured — should fall back to mock limiters
vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')

vi.mock('@upstash/ratelimit', () => ({
    Ratelimit: class MockRatelimit {
        static slidingWindow = vi.fn()
        limit = vi.fn(async () => ({ success: true, limit: 100, remaining: 99, reset: Date.now() + 10000 }))
    },
}))

vi.mock('@upstash/redis', () => ({
    Redis: class MockRedis {},
}))

describe('ratelimit (mock/fallback mode)', () => {
    it('contactFormLimiter.limit always succeeds when Upstash is not configured', async () => {
        const { contactFormLimiter } = await import('@/lib/ratelimit')
        const result = await contactFormLimiter.limit('test-ip')
        expect(result.success).toBe(true)
        expect(result.remaining).toBeGreaterThanOrEqual(0)
    })

    it('flagSubmitLimiter.limit always succeeds when Upstash is not configured', async () => {
        const { flagSubmitLimiter } = await import('@/lib/ratelimit')
        const result = await flagSubmitLimiter.limit('test-member')
        expect(result.success).toBe(true)
    })

    it('registerLimiter.limit always succeeds when Upstash is not configured', async () => {
        const { registerLimiter } = await import('@/lib/ratelimit')
        const result = await registerLimiter.limit('test@example.com')
        expect(result.success).toBe(true)
    })

    it('magicLinkLimiter.limit always succeeds when Upstash is not configured', async () => {
        const { magicLinkLimiter } = await import('@/lib/ratelimit')
        const result = await magicLinkLimiter.limit('test@example.com')
        expect(result.success).toBe(true)
    })
})
