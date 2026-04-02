// components/DocumentCard.tsx
// Displays a single document in a card format.
// Shows file type badge, title, uploader name, date, and download/delete buttons.

'use client'

import { Download, Trash2 } from 'lucide-react'

type Document = {
    id: string
    title: string
    file_url: string
    file_type: 'pdf' | 'docx' | 'doc' | null
    uploaded_by: string | null
    created_at: string
    uploader?: { name?: string | null; email?: string | null }
}

type DocumentCardProps = {
    document: Document
    currentUserId: string | null
    currentUserRole: string | null
    onDelete: (docId: string) => void
}

// Map file types to colors for the badge
const fileTypeColors: Record<string, { bg: string; text: string }> = {
    pdf: { bg: 'bg-red-50', text: 'text-red-700' },
    docx: { bg: 'bg-blue-50', text: 'text-blue-700' },
    doc: { bg: 'bg-blue-50', text: 'text-blue-700' },
}

export default function DocumentCard({
    document,
    currentUserId,
    currentUserRole,
    onDelete,
}: DocumentCardProps) {
    // Check if the current user can delete (own documents OR admin)
    const canDelete = currentUserId === document.uploaded_by || currentUserRole === 'admin'

    // Format date
    const formattedDate = new Date(document.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })

    // Get badge colors based on file type
    const colors = fileTypeColors[document.file_type || ''] || { bg: 'bg-slate-50', text: 'text-slate-700' }

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 transition-all hover:shadow-md">
            {/* File type icon */}
            <div className={`shrink-0 w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                <span className={`text-xs font-bold uppercase ${colors.text}`}>
                    {document.file_type || '?'}
                </span>
            </div>

            {/* Document info */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 truncate">{document.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                    Uploaded by {document.uploader?.name || document.uploader?.email || 'Unknown'} · {formattedDate}
                </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
                {/* Download button */}
                <a
                    href={document.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                    <Download className="w-3.5 h-3.5" />
                    Download
                </a>

                {/* Delete button — only shown if user has permission */}
                {canDelete && (
                    <button
                        onClick={() => onDelete(document.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete document"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    )
}
