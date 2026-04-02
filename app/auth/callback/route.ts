// app/auth/callback/route.ts
// This route handles the magic link redirect from Supabase.
// When a user clicks the magic link in their email, they land here.
// This code exchanges the temporary auth code for a real session cookie.

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)

    // Supabase sends a "code" parameter in the URL after the user clicks the magic link
    const code = requestUrl.searchParams.get('code')

    if (code) {
        // Create a Supabase server client with cookie access
        const supabase = await createServerSupabaseClient()

        // Exchange the temporary code for a real user session
        await supabase.auth.exchangeCodeForSession(code)
    }

    // After session is created, redirect to dashboard
    // The middleware will then check their member status and redirect accordingly
    return NextResponse.redirect(new URL('/portal/dashboard', requestUrl.origin))
}
