// __tests__/register.test.ts — Register API route schema + logic tests
import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Re-define the register schema (same as in route.ts) to test independently
const registerSchema = z.object({
    email: z.string().email('Invalid email address').transform(v => v.toLowerCase().trim()),
    password: z.string().min(6, 'Password must be at least 6 characters').max(72, 'Password too long'),
    full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    student_id: z.string().min(1, 'Student ID is required').max(20).optional(),
    program: z.enum(['BCS', 'BBUS', 'BIHM', 'MBA', 'Other']).optional(),
    intake: z.string().max(30).optional(),
    bio: z.string().max(500).optional(),
    skills: z.array(z.string().max(50)).max(20).default([]),
})

describe('Register API schema', () => {
    const validPayload = {
        email: 'test@iims.edu.np',
        password: 'SecurePass123',
        full_name: 'Test User',
        student_id: '23456',
        program: 'BCS' as const,
    }

    it('accepts a valid registration payload', () => {
        const result = registerSchema.safeParse(validPayload)
        expect(result.success).toBe(true)
    })

    it('lowercases email', () => {
        // Zod v4 validates before transform — input must be valid email (no leading/trailing spaces)
        const result = registerSchema.parse({ ...validPayload, email: 'TEST@IIMS.edu.np' })
        expect(result.email).toBe('test@iims.edu.np')
    })

    it('rejects password shorter than 6 chars', () => {
        const result = registerSchema.safeParse({ ...validPayload, password: '12345' })
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('6 characters')
        }
    })

    it('rejects password longer than 72 chars', () => {
        const result = registerSchema.safeParse({ ...validPayload, password: 'a'.repeat(73) })
        expect(result.success).toBe(false)
    })

    it('rejects invalid email', () => {
        const result = registerSchema.safeParse({ ...validPayload, email: 'not-an-email' })
        expect(result.success).toBe(false)
    })

    it('rejects full_name shorter than 2 chars', () => {
        const result = registerSchema.safeParse({ ...validPayload, full_name: 'A' })
        expect(result.success).toBe(false)
    })

    it('defaults skills to empty array', () => {
        const result = registerSchema.parse(validPayload)
        expect(result.skills).toEqual([])
    })

    it('accepts optional fields being omitted', () => {
        const result = registerSchema.safeParse({
            email: 'test@iims.edu.np',
            password: 'SecurePass123',
            full_name: 'Test User',
        })
        expect(result.success).toBe(true)
    })

    it('rejects invalid program enum', () => {
        const result = registerSchema.safeParse({ ...validPayload, program: 'INVALID' })
        expect(result.success).toBe(false)
    })

    it('accepts bio within limit', () => {
        const result = registerSchema.safeParse({ ...validPayload, bio: 'Short bio' })
        expect(result.success).toBe(true)
    })

    it('rejects bio exceeding 500 chars', () => {
        const result = registerSchema.safeParse({ ...validPayload, bio: 'x'.repeat(501) })
        expect(result.success).toBe(false)
    })

    it('limits skills array to 20', () => {
        const tooManySkills = Array.from({ length: 21 }, (_, i) => `skill${i}`)
        const result = registerSchema.safeParse({ ...validPayload, skills: tooManySkills })
        expect(result.success).toBe(false)
    })
})
