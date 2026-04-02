// components/ui/Badge.tsx — IIMS IT Club v4.0 status badges
import { cn } from '@/lib/utils'

interface BadgeProps {
    variant?: 'navy' | 'crimson' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'default'
    children: React.ReactNode
    className?: string
}

// Colors per CONTEXT.md §4.2
const variants: Record<string, string> = {
    navy: 'text-cosmic-brand bg-cosmic-light border border-cosmic-brand/20',
    crimson: 'text-cosmic-black bg-cosmic-brand/10 border border-cosmic-black/20',
    success: 'text-[#2E7D32] bg-[#E8F5E9] border border-[#2E7D32]/20',
    warning: 'text-[#F57F17] bg-cosmic-light border border-cosmic-brand/20',
    danger: 'text-cosmic-brand bg-cosmic-brand/10 border border-cosmic-brand/20',
    info: 'text-cosmic-brand bg-cosmic-brand/10 border border-[#0277BD]/20',
    outline: 'border border-cosmic-accent text-cosmic-accent bg-transparent',
    default: 'text-cosmic-accent bg-[var(--color-cosmic-light)] border border-cosmic-accent',
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    )
}

// Status-specific helpers
export function MemberStatusBadge({ status }: { status: string }) {
    const map: Record<string, 'warning' | 'success' | 'danger' | 'default'> = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger',
        banned: 'danger',
    }
    return <Badge variant={map[status] ?? 'default'}>{status}</Badge>
}

export function RoleBadge({ role }: { role: string }) {
    const map: Record<string, 'navy' | 'crimson' | 'info' | 'default'> = {
        superadmin: 'navy',
        admin: 'crimson',
        member: 'default',
    }
    return <Badge variant={map[role] ?? 'default'}>{role}</Badge>
}
