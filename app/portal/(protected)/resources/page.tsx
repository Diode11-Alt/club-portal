// app/portal/resources/page.tsx — IIMS IT Club Document Archive (v4.0)
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import ResourcesClient from '@/components/portal/ResourcesClient'
import { redirect } from 'next/navigation'
import Pagination from '@/components/ui/Pagination'
import { getSession, getMember } from '@/lib/auth'



export default async function ResourcesPage(props: {
    searchParams: Promise<{ page?: string }>
}) {
    const searchParams = await props.searchParams
    const session = await getSession()
    if (!session) redirect('/portal/login')

    const member = await getMember(session.user.id)
    if (!member) redirect('/portal/pending')

    const currentPage = parseInt(searchParams.page || '1')
    const pageSize = 12
    const from = (currentPage - 1) * pageSize
    const to = from + pageSize - 1

    const supabase = createAdminSupabaseClient()

    // Fetch documents with .range() for pagination
    const { data: docs, count } = await supabase
        .from('documents')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-16 animate-fade-up">
            <ResourcesClient
                initialDocs={(docs || [])}
                userRole={member.role}
            />

            {count && count > pageSize && (
                <div className="py-10 border-t border-cosmic-accent">
                    <Pagination
                        page={currentPage}
                        totalPages={Math.ceil(count / pageSize)}
                        baseUrl="/portal/resources"
                    />
                </div>
            )}

            <footer className="text-center pt-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#BDBDBD]">Archive End Point</p>
            </footer>
        </div>
    )
}
