'use client'

import { ShieldAlert, Terminal, Clock, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'

type AuditLog = any

export default function AuditTab({ logs }: { logs: AuditLog[] }) {
    return (
        <div className="space-y-8 animate-fade-up">
            <div className="bg-white rounded-[2rem] border border-cosmic-accent shadow-sm overflow-hidden">
                <div className="p-8 border-b border-[#EEEEEE] flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-cosmic-black">System Audit Logs</h2>
                        <p className="text-cosmic-accent text-sm mt-1">Immutable record of high-level administrative actions.</p>
                    </div>
                    <div className="h-12 w-12 bg-cosmic-brand/10 rounded-sm flex items-center justify-center border border-[#FFCDD2]">
                        <ShieldAlert className="h-6 w-6 text-cosmic-brand" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-cosmic-light border-b border-cosmic-accent">
                                <th className="px-8 py-5 text-[10px] font-bold text-cosmic-accent uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-cosmic-accent uppercase tracking-widest">Actor ID</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-cosmic-accent uppercase tracking-widest">Action Event</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-cosmic-accent uppercase tracking-widest">Target ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EEEEEE]">
                            {logs && logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr key={log.id} className="group hover:bg-cosmic-light transition-all">
                                        <td className="px-8 py-5 text-sm text-cosmic-accent flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-cosmic-accent" />
                                            {formatDate(log.created_at)}
                                        </td>
                                        <td className="px-8 py-5 text-sm font-medium text-cosmic-black">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-cosmic-brand" />
                                                {log.actor_id || log.admin_id || 'System'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border bg-cosmic-brand/10 text-[#1976D2] border-[#BBDEFB]">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-cosmic-accent">
                                            <div className="flex items-center gap-2 font-mono text-xs">
                                                <Terminal className="w-3.5 h-3.5 text-cosmic-accent" />
                                                {log.target_id || 'N/A'}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-cosmic-accent font-medium text-sm">
                                        No audit logs recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
