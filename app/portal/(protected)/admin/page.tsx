// app/portal/admin/page.tsx — IIMS IT Club Base Command (v4.0)
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Loader2, AlertTriangle } from 'lucide-react'
import AdminSidebar, { AdminTab } from '@/components/portal/admin/AdminSidebar'
import OverviewTab from '@/components/portal/admin/OverviewTab'
import MembersTab from '@/components/portal/admin/MembersTab'
import FeedTab from '@/components/portal/admin/FeedTab'
import ResourcesTab from '@/components/portal/admin/ResourcesTab'
import EventsTab from '@/components/portal/admin/EventsTab'
import CTFTab from '@/components/portal/admin/CTFTab'
import AuditTab from '@/components/portal/admin/AuditTab'

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<AdminTab>('overview')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<any>({
        currentUser: null, members: [], posts: [], events: [], challenges: [], resources: [], auditLogs: []
    })

    const supabase = createClient()
    const router = useRouter()

    const loadData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            // Fetch all admin data through the server-side API route
            // which uses the service role key and bypasses RLS
            const res = await fetch('/api/admin/members')
            if (res.status === 401 || res.status === 403) {
                router.push('/portal/login')
                return
            }
            if (!res.ok) {
                throw new Error('Failed to load admin data')
            }

            const adminData = await res.json()
            setData({
                currentUser: adminData.currentUser,
                members: adminData.members || [],
                posts: adminData.posts || [],
                events: adminData.events || [],
                challenges: adminData.challenges || [],
                resources: adminData.resources || [],
                auditLogs: adminData.auditLogs || []
            })
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load data')
        } finally {
            setLoading(false)
        }
    }, [supabase, router])

    useEffect(() => {
        loadData()
    }, [loadData])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] animate-pulse">
                <div className="h-16 w-16 bg-cosmic-light rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-cosmic-accent">
                    <Loader2 className="h-8 w-8 text-cosmic-brand animate-spin" />
                </div>
                <p className="text-[10px] font-bold text-cosmic-accent uppercase tracking-widest">Loading Admin Data</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center p-12">
                <AlertTriangle className="h-12 w-12 text-cosmic-black mb-6" />
                <h2 className="text-2xl font-bold text-cosmic-black mb-2">Connection Error</h2>
                <p className="text-cosmic-accent max-w-sm mb-8 font-medium">{error}</p>
                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-cosmic-brand text-white rounded-sm font-bold tracking-widest text-xs uppercase shadow-sm shadow-[#124E66]/20 hover:bg-cosmic-dark transition-colors">
                    Retry Connection
                </button>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden -m-8">
            <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} currentUser={data.currentUser} />

            <main className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar animate-fade-up">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-cosmic-black/10 text-cosmic-brand font-bold text-[10px] uppercase tracking-widest mb-3 border border-[#FFCDD2]">
                            <ShieldCheck className="h-3.5 w-3.5" /> Administration
                        </div>
                        <h1 className="text-4xl font-bold text-cosmic-black capitalize leading-tight">
                            {activeTab.replace('-', ' ')}
                        </h1>
                    </div>
                </header>

                <div className="pb-20">
                    {activeTab === 'overview' && <OverviewTab data={data} />}
                    {activeTab === 'members' && <MembersTab members={data.members} currentUser={data.currentUser} refresh={loadData} />}
                    {activeTab === 'posts' && <FeedTab posts={data.posts} refresh={loadData} />}
                    {activeTab === 'events' && <EventsTab events={data.events} refresh={loadData} />}
                    {activeTab === 'ctf' && <CTFTab challenges={data.challenges} refresh={loadData} />}
                    {activeTab === 'documents' && <ResourcesTab resources={data.resources} refresh={loadData} />}
                    {activeTab === 'audit' && <AuditTab logs={data.auditLogs} />}
                </div>
            </main>
        </div>
    )
}
