// middleware.ts — IIMS IT Club Portal (CONTEXT.md §10.5 — exact spec)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    const response = NextResponse.next({ request: { headers: request.headers } })

    // ── Anon client for session check (cookie-aware) ──
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name) => request.cookies.get(name)?.value,
                set: (name, value, options) => { response.cookies.set({ name, value, ...options }) },
                remove: (name, options) => {
                    response.cookies.set({ name, value: '', ...options, maxAge: 0, path: '/' })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const session = user ? { user } : null
    const path = request.nextUrl.pathname

    // Only protect /portal/* (except login, register, pending)
    const isProtected = path.startsWith('/portal') &&
        !['/portal/login', '/portal/pending', '/portal/register'].some(p => path.startsWith(p))

    if (!isProtected) return response
    if (!session) return NextResponse.redirect(new URL('/portal/login', request.url))

    // ── Check member status (uses user_id FK — FIX #2) ──
    const { data: member } = await supabase
        .from('members')
        .select('status, role')
        .eq('user_id', session.user.id)  // ✅ user_id (auth FK), NEVER .eq('id', ...)
        .single()

    // No member row → pending (DB trigger should have created it)
    if (!member || member.status === 'pending') {
        return NextResponse.redirect(new URL('/portal/pending', request.url))
    }

    if (member.status === 'rejected') {
        return NextResponse.redirect(new URL('/portal/login?reason=rejected', request.url))
    }

    if (member.status === 'banned') {
        // FIX #9: Clear ALL sb-* cookies using path: '/' to prevent infinite redirect
        const banRes = NextResponse.redirect(new URL('/portal/login?reason=banned', request.url))
        request.cookies.getAll().forEach(cookie => {
            if (cookie.name.startsWith('sb-')) {
                banRes.cookies.set({ name: cookie.name, value: '', maxAge: 0, path: '/' })
            }
        })
        return banRes
    }

    // Admin-only route guard
    if (path.startsWith('/portal/admin') && !['admin', 'superadmin'].includes(member.role)) {
        return NextResponse.redirect(new URL('/portal/dashboard', request.url))
    }

    // Superadmin route guard
    if (path.startsWith('/portal/superadmin') && member.role !== 'superadmin') {
        return NextResponse.redirect(new URL('/portal/dashboard', request.url))
    }

    return response
}

export const config = { matcher: ['/portal/:path*'] }
