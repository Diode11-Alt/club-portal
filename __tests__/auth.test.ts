// __tests__/auth.test.ts — Auth helper tests
import { describe, it, expect, vi } from 'vitest'

// Use importOriginal to get the REAL handleAuthError while keeping other exports mocked
vi.mock(import('@/lib/auth'), async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        getSession: vi.fn(async () => ({ user: { id: 'test-user-123' } })),
        getMember: vi.fn(async () => ({
            id: 'member-123',
            role: 'member',
            full_name: 'Test Member',
            status: 'approved'
        })),
        assertRole: vi.fn(),
    }
})

import { handleAuthError } from '@/lib/auth'

describe('handleAuthError', () => {
    it('returns 401 for UNAUTHENTICATED', () => {
        const res = handleAuthError(new Error('UNAUTHENTICATED'))
        expect(res.status).toBe(401)
    })

    it('returns 401 for MEMBER_NOT_FOUND', () => {
        const res = handleAuthError(new Error('MEMBER_NOT_FOUND'))
        expect(res.status).toBe(401)
    })

    it('returns 403 for NOT_APPROVED', () => {
        const res = handleAuthError(new Error('NOT_APPROVED'))
        expect(res.status).toBe(403)
    })

    it('returns 403 for INSUFFICIENT_ROLE', () => {
        const res = handleAuthError(new Error('INSUFFICIENT_ROLE'))
        expect(res.status).toBe(403)
    })

    it('returns 500 for unknown errors', () => {
        const res = handleAuthError(new Error('SOMETHING_ELSE'))
        expect(res.status).toBe(500)
    })

    it('returns 500 for non-Error values', () => {
        const res = handleAuthError('string error')
        expect(res.status).toBe(500)
    })

    it('returns JSON body with error message', async () => {
        const res = handleAuthError(new Error('UNAUTHENTICATED'))
        const body = await res.json()
        expect(body.error).toBe('UNAUTHENTICATED')
    })
})
