// lib/auth.ts — Auth helpers for IIMS IT Club Portal
// assertRole() is the FIRST call in every admin API route.
import 'server-only'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { createServerClient as createSSRClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

type Role = 'member' | 'bod' | 'admin' | 'superadmin'
type MemberRow = Database['public']['Tables']['members']['Row']

/** Get the current session from the request cookies */
export const getSession = cache(async () => {
    const cookieStore = await cookies()
    const supabase = createSSRClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name) => cookieStore.get(name)?.value,
                set: () => { },
                remove: () => { },
            },
        }
    )
    const { data: { user } } = await supabase.auth.getUser()
    const session = user ? { user } : null
    return session
})

/**
 * Get the current member from the database.
 * Uses user_id FK (auth.users.id) — NEVER id (members.id).
 */
export const getMember = cache(async (userId: string): Promise<MemberRow | null> => {
    const supabase = createAdminSupabaseClient()
    const { data, error } = await (supabase
        .from('members' as any) as any)
        .select('id, user_id, full_name, email, role, status, club_post, avatar_url, points, program')
        .eq('user_id', userId) // ✅ user_id FK — NEVER .eq('id', userId)
        .single()

    if (error || !data) return null
    return data as unknown as MemberRow
})

/**
 * assertRole — MUST be the first call in every admin API route.
 * Throws on failure — caller handles with try/catch → 403.
 */
export async function assertRole(minRole: Role): Promise<Pick<MemberRow, 'id' | 'role' | 'status' | 'club_post'>> {
    const session = await getSession()
    if (!session) throw new Error('UNAUTHENTICATED')

    const supabase = createAdminSupabaseClient()
    const { data: member, error } = await (supabase
        .from('members' as any) as any)
        .select('id, role, status, club_post')
        .eq('user_id', session.user.id) // ✅ user_id FK — NEVER .eq('id', ...)
        .single()

    if (error || !member) throw new Error('MEMBER_NOT_FOUND')
    if (member.status !== 'approved') throw new Error('NOT_APPROVED')

    const hierarchy: Record<Role, number> = { member: 0, bod: 1, admin: 2, superadmin: 3 }
    const memberRole = member.role as Role
    if (hierarchy[memberRole] < hierarchy[minRole]) {
        throw new Error('INSUFFICIENT_ROLE')
    }

    return member as Pick<MemberRow, 'id' | 'role' | 'status' | 'club_post'>
}

/**
 * assertSuperadminOrPresident - used for role and club_post assignments
 */
export async function assertSuperadminOrPresident(): Promise<Pick<MemberRow, 'id' | 'role' | 'status' | 'club_post'>> {
    const session = await getSession()
    if (!session) throw new Error('UNAUTHENTICATED')

    const supabase = createAdminSupabaseClient()
    const { data: member, error } = await (supabase
        .from('members' as any) as any)
        .select('id, role, status, club_post')
        .eq('user_id', session.user.id)
        .single()

    if (error || !member) throw new Error('MEMBER_NOT_FOUND')
    if (member.status !== 'approved') throw new Error('NOT_APPROVED')

    if (member.role !== 'superadmin' && member.club_post !== 'President') {
        throw new Error('INSUFFICIENT_ROLE')
    }

    return member as Pick<MemberRow, 'id' | 'role' | 'status' | 'club_post'>
}

/**
 * assertSuperadmin - strictly for superadmin-only actions
 */
export async function assertSuperadmin(): Promise<Pick<MemberRow, 'id' | 'role' | 'status' | 'club_post'>> {
    const session = await getSession()
    if (!session) throw new Error('UNAUTHENTICATED')

    const supabase = createAdminSupabaseClient()
    const { data: member, error } = await (supabase
        .from('members' as any) as any)
        .select('id, role, status, club_post')
        .eq('user_id', session.user.id)
        .single()

    if (error || !member) throw new Error('MEMBER_NOT_FOUND')
    if (member.status !== 'approved') throw new Error('NOT_APPROVED')

    if (member.role !== 'superadmin') {
        throw new Error('INSUFFICIENT_ROLE')
    }

    return member as Pick<MemberRow, 'id' | 'role' | 'status' | 'club_post'>
}

/**
 * assertSuperadminOrPresidentOrAdmin - strictly for admin actions
 */
export async function assertSuperadminOrPresidentOrAdmin(): Promise<Pick<MemberRow, 'id' | 'role' | 'status' | 'club_post'>> {
    const session = await getSession()
    if (!session) throw new Error('UNAUTHENTICATED')

    const supabase = createAdminSupabaseClient()
    const { data: member, error } = await (supabase
        .from('members' as any) as any)
        .select('id, role, status, club_post')
        .eq('user_id', session.user.id)
        .single()

    if (error || !member) throw new Error('MEMBER_NOT_FOUND')
    if (member.status !== 'approved') throw new Error('NOT_APPROVED')

    if (member.role !== 'superadmin' && member.role !== 'admin' && member.club_post !== 'President') {
        throw new Error('INSUFFICIENT_ROLE')
    }

    return member as Pick<MemberRow, 'id' | 'role' | 'status' | 'club_post'>
}

/** Standard error response handler for assertRole failures */
export function handleAuthError(err: unknown): Response {
    const message = err instanceof Error ? err.message : 'UNKNOWN_ERROR'
    const statusMap: Record<string, number> = {
        UNAUTHENTICATED: 401,
        MEMBER_NOT_FOUND: 401,
        NOT_APPROVED: 403,
        INSUFFICIENT_ROLE: 403,
    }
    return Response.json(
        { error: message },
        { status: statusMap[message] ?? 500 }
    )
}
