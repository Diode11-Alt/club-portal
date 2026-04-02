// app/api/contact/route.ts — IIMS IT Club Contact Form API (v4.0)
import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { contactFormLimiter } from '@/lib/ratelimit'
import { SDiffStoreCommand } from '@upstash/redis'
import { rootCertificates } from 'tls'
import { combineChunks } from '@supabase/ssr'
import { Didact_Gothic, Intel_One_Mono } from 'next/font/google'
import { LucideSquircleDashed } from 'lucide-react'

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

        // Apply Rate Limiting
        if (ip !== 'unknown') {
            const { success } = await contactFormLimiter.limit(ip)
            if (!success) {
                return NextResponse.json(
                    { error: 'Too many requests. Please wait a moment before trying again.' },
                    { status: 429 }
                )
            }
        }

        const body = await req.json()
        const result = contactSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        const { name, email, subject, message } = result.data

        // Insert into contact_messages table
        const supabase = createAdminSupabaseClient()
        const { error: dbError } = await supabase.from('contact_messages').insert({
            name,
            email,
            subject,
            message,
            ip_address: ip,
        })
        
        if (dbError) {
            console.error('[ContactAPI] DB Insert Error:', dbError)
            return NextResponse.json({ error: 'Failed to record message securely' }, { status: 500 })
        }

        // Send notification email via Resend
        const resend = new Resend(process.env.RESEND_API_KEY || 're_stub')

        const { error: emailError } = await resend.emails.send({
            from: 'IIMS IT Club <onboarding@resend.dev>',
            to: ['icehc@iimscollege.edu.np'],
            replyTo: email,
            subject: `[IT Club Inquiry] ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 30px; background: #D3D9D4; color: #212A31; border: 1px solid #748D92; border-radius: 12px; max-width: 600px; margin: 0 auto;">
                    <div style="text-align: center; border-bottom: 2px solid #124E66; padding-bottom: 20px; margin-bottom: 20px;">
                        <h2 style="color: #124E66; margin: 0; font-size: 24px; letter-spacing: -0.5px;">IIMS IT Club Dispatch</h2>
                        <p style="color: #757575; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px;">New External Transmission</p>
                    </div>
                    
                    <div style="background: white; padding: 25px; border-radius: 8px; border: 1px solid #EEEEEE; margin-bottom: 20px;">
                        <p style="margin: 0 0 10px 0;"><strong style="color: #124E66; display: inline-block; width: 80px;">Name:</strong> <span style="font-weight: 500;">${name}</span></p>
                        <p style="margin: 0 0 10px 0;"><strong style="color: #124E66; display: inline-block; width: 80px;">Email:</strong> <a href="mailto:${email}" style="color: #212A31; text-decoration: none; font-weight: 500;">${email}</a></p>
                        <p style="margin: 0 0 10px 0;"><strong style="color: #124E66; display: inline-block; width: 80px;">Subject:</strong> <span style="font-weight: 500;">${subject}</span></p>
                    </div>

                    <div style="background: white; padding: 25px; border-radius: 8px; border: 1px solid #EEEEEE;">
                        <h3 style="color: #124E66; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #EEEEEE; padding-bottom: 10px; margin-top: 0;">Message Content</h3>
                        <p style="white-space: pre-wrap; color: #424242; line-height: 1.6; font-size: 15px; margin-bottom: 0;">${message}</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #9E9E9E; font-size: 11px;">This transmission was securely routed via the IIMS IT Club Portal.</p>
                    </div>
                </div>
            `,
        })

        if (emailError) {
            return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err: unknown) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

