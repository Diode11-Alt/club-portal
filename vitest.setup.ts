import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn(),
    }),
    usePathname: () => '',
    redirect: vi.fn(),
}))

// Mock Supabase Admin Client (canonical path)
vi.mock('@/lib/supabase/server', () => ({
    createAdminSupabaseClient: vi.fn(() => ({
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            range: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            single: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
        })),
        auth: {
            admin: {
                createUser: vi.fn(),
            },
        },
    })),
    createServerSupabaseClient: vi.fn(),
}))

// Mock Supabase Browser Client
vi.mock('@/lib/supabase/client', () => ({
    createClient: vi.fn(() => ({
        channel: vi.fn(() => ({
            on: vi.fn().mockReturnThis(),
            subscribe: vi.fn(),
        })),
        removeChannel: vi.fn(),
    })),
}))

// Mock Auth
vi.mock('@/lib/auth', () => ({
    getSession: vi.fn(async () => ({ user: { id: 'test-user-123' } })),
    getMember: vi.fn(async () => ({
        id: 'member-123',
        role: 'member',
        full_name: 'Test Member',
        status: 'approved'
    })),
    assertRole: vi.fn(),
}))

// Mock server-only (no-op in test env)
vi.mock('server-only', () => ({}))
