// __tests__/validations.test.ts — Zod schema validation tests
import { describe, it, expect } from 'vitest'
import {
    magicLinkSchema,
    registerSchema,
    profileUpdateSchema,
    createPostSchema,
    memberStatusSchema,
    contactSchema,
    ctfSubmitSchema,
    createEventSchema,
    createChallengeSchema,
    broadcastSchema,
    sendMessageSchema,
    rsvpSchema,
} from '@/lib/validations'

// ─── magicLinkSchema ──────────────────────────────────────────────────────────

describe('magicLinkSchema', () => {
    it('accepts a valid email', () => {
        const result = magicLinkSchema.safeParse({ email: 'john@iims.edu.np' })
        expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
        const result = magicLinkSchema.safeParse({ email: 'not-an-email' })
        expect(result.success).toBe(false)
    })

    it('lowercases a valid email', () => {
        // Zod v4 validates before transform, so input must be valid email (no spaces)
        const result = magicLinkSchema.parse({ email: 'John@IIMS.edu.np' })
        expect(result.email).toBe('john@iims.edu.np')
    })
})

// ─── registerSchema ───────────────────────────────────────────────────────────

describe('registerSchema', () => {
    const validData = {
        full_name: 'Sujal Mainali',
        student_id: '23456',
        program: 'BCS' as const,
    }

    it('accepts valid registration data', () => {
        const result = registerSchema.safeParse(validData)
        expect(result.success).toBe(true)
    })

    it('rejects name shorter than 2 chars', () => {
        const result = registerSchema.safeParse({ ...validData, full_name: 'A' })
        expect(result.success).toBe(false)
    })

    it('rejects invalid program', () => {
        const result = registerSchema.safeParse({ ...validData, program: 'INVALID' })
        expect(result.success).toBe(false)
    })

    it('defaults skills to empty array', () => {
        const result = registerSchema.parse(validData)
        expect(result.skills).toEqual([])
    })

    it('rejects student_id shorter than 3 chars', () => {
        const result = registerSchema.safeParse({ ...validData, student_id: 'AB' })
        expect(result.success).toBe(false)
    })
})

// ─── profileUpdateSchema ─────────────────────────────────────────────────────

describe('profileUpdateSchema', () => {
    it('accepts valid github_url', () => {
        const result = profileUpdateSchema.safeParse({
            github_url: 'https://github.com/sujal',
        })
        expect(result.success).toBe(true)
    })

    it('accepts empty string for github_url', () => {
        const result = profileUpdateSchema.safeParse({ github_url: '' })
        expect(result.success).toBe(true)
    })

    it('rejects non-github URL for github_url', () => {
        const result = profileUpdateSchema.safeParse({
            github_url: 'https://example.com/sujal',
        })
        expect(result.success).toBe(false)
    })

    it('accepts valid linkedin_url', () => {
        const result = profileUpdateSchema.safeParse({
            linkedin_url: 'https://linkedin.com/in/sujal',
        })
        expect(result.success).toBe(true)
    })

    it('rejects bio longer than 500 chars', () => {
        const result = profileUpdateSchema.safeParse({ bio: 'a'.repeat(501) })
        expect(result.success).toBe(false)
    })
})

// ─── createPostSchema ─────────────────────────────────────────────────────────

describe('createPostSchema', () => {
    it('accepts valid post', () => {
        const result = createPostSchema.safeParse({ content: 'Hello world!' })
        expect(result.success).toBe(true)
    })

    it('rejects empty content', () => {
        const result = createPostSchema.safeParse({ content: '' })
        expect(result.success).toBe(false)
    })

    it('defaults type to post', () => {
        const result = createPostSchema.parse({ content: 'Test' })
        expect(result.type).toBe('post')
    })

    it('rejects invalid type', () => {
        const result = createPostSchema.safeParse({ content: 'Test', type: 'blog' })
        expect(result.success).toBe(false)
    })
})

// ─── memberStatusSchema ──────────────────────────────────────────────────────

describe('memberStatusSchema', () => {
    it('accepts valid member status change', () => {
        const result = memberStatusSchema.safeParse({
            member_id: '550e8400-e29b-41d4-a716-446655440000',
            status: 'approved',
        })
        expect(result.success).toBe(true)
    })

    it('rejects non-UUID member_id', () => {
        const result = memberStatusSchema.safeParse({
            member_id: 'not-a-uuid',
            status: 'approved',
        })
        expect(result.success).toBe(false)
    })

    it('rejects invalid status', () => {
        const result = memberStatusSchema.safeParse({
            member_id: '550e8400-e29b-41d4-a716-446655440000',
            status: 'active',
        })
        expect(result.success).toBe(false)
    })
})

// ─── contactSchema ───────────────────────────────────────────────────────────

describe('contactSchema', () => {
    const valid = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Hello there',
        message: 'This is a test message for contact form',
    }

    it('accepts valid contact data', () => {
        const result = contactSchema.safeParse(valid)
        expect(result.success).toBe(true)
    })

    it('rejects short subject', () => {
        const result = contactSchema.safeParse({ ...valid, subject: 'Hi' })
        expect(result.success).toBe(false)
    })

    it('rejects short message', () => {
        const result = contactSchema.safeParse({ ...valid, message: 'Short' })
        expect(result.success).toBe(false)
    })
})

// ─── ctfSubmitSchema ─────────────────────────────────────────────────────────

describe('ctfSubmitSchema', () => {
    it('accepts valid flag submission', () => {
        const result = ctfSubmitSchema.safeParse({
            challenge_id: '550e8400-e29b-41d4-a716-446655440000',
            flag: 'ICEHC{test_flag}',
        })
        expect(result.success).toBe(true)
    })

    it('rejects empty flag', () => {
        const result = ctfSubmitSchema.safeParse({
            challenge_id: '550e8400-e29b-41d4-a716-446655440000',
            flag: '',
        })
        expect(result.success).toBe(false)
    })
})

// ─── createEventSchema ──────────────────────────────────────────────────────

describe('createEventSchema', () => {
    const valid = {
        title: 'Hackathon 2026',
        slug: 'hackathon-2026',
        description: 'A weekend hackathon',
        event_date: '2026-05-01T10:00:00Z',
    }

    it('accepts valid event', () => {
        const result = createEventSchema.safeParse(valid)
        expect(result.success).toBe(true)
    })

    it('rejects slug with uppercase', () => {
        const result = createEventSchema.safeParse({ ...valid, slug: 'Hackathon-2026' })
        expect(result.success).toBe(false)
    })

    it('rejects short description', () => {
        const result = createEventSchema.safeParse({ ...valid, description: 'Short' })
        expect(result.success).toBe(false)
    })
})

// ─── createChallengeSchema ──────────────────────────────────────────────────

describe('createChallengeSchema', () => {
    const valid = {
        title: 'SQL Injection 101',
        description: 'Find the SQL injection vulnerability in the login form.',
        category: 'web' as const,
        difficulty: 'easy' as const,
        points: 100,
        flag: 'ICEHC{sqli_easy}',
    }

    it('accepts valid challenge', () => {
        const result = createChallengeSchema.safeParse(valid)
        expect(result.success).toBe(true)
    })

    it('rejects invalid category', () => {
        const result = createChallengeSchema.safeParse({ ...valid, category: 'blockchain' })
        expect(result.success).toBe(false)
    })

    it('rejects zero points', () => {
        const result = createChallengeSchema.safeParse({ ...valid, points: 0 })
        expect(result.success).toBe(false)
    })
})

// ─── broadcastSchema ────────────────────────────────────────────────────────

describe('broadcastSchema', () => {
    it('accepts broadcast with empty link', () => {
        const result = broadcastSchema.safeParse({ title: 'Test Broadcast', link: '' })
        expect(result.success).toBe(true)
    })

    it('accepts broadcast with valid link', () => {
        const result = broadcastSchema.safeParse({ title: 'Test Broadcast', link: 'https://iims.edu.np' })
        expect(result.success).toBe(true)
    })
})

// ─── sendMessageSchema ──────────────────────────────────────────────────────

describe('sendMessageSchema', () => {
    it('accepts valid message', () => {
        const result = sendMessageSchema.safeParse({
            conversation_id: '550e8400-e29b-41d4-a716-446655440000',
            content: 'Hello!',
        })
        expect(result.success).toBe(true)
    })

    it('rejects empty content', () => {
        const result = sendMessageSchema.safeParse({
            conversation_id: '550e8400-e29b-41d4-a716-446655440000',
            content: '',
        })
        expect(result.success).toBe(false)
    })
})

// ─── rsvpSchema ─────────────────────────────────────────────────────────────

describe('rsvpSchema', () => {
    it('accepts valid RSVP', () => {
        const result = rsvpSchema.safeParse({
            event_id: '550e8400-e29b-41d4-a716-446655440000',
            status: 'going',
        })
        expect(result.success).toBe(true)
    })

    it('rejects invalid status', () => {
        const result = rsvpSchema.safeParse({
            event_id: '550e8400-e29b-41d4-a716-446655440000',
            status: 'interested',
        })
        expect(result.success).toBe(false)
    })
})
