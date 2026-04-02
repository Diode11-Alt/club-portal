// components/ui/Avatar.tsx — IIMS Collegiate member avatar with fallback initials
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
    src?: string | null
    name?: string | null
    size?: 'xs' | 'sm' | 'md' | 'lg'
    className?: string
}

const sizeMap = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
}

function getInitials(name: string | null | undefined): string {
    if (!name) return '?'
    return name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export default function Avatar({ src, name, size = 'md', className }: AvatarProps) {
    const sizeClass = sizeMap[size]

    if (src) {
        return (
            <div className={cn('relative rounded-full overflow-hidden bg-[#F3F4F6] flex-shrink-0', sizeClass, className)}>
                <Image src={src} alt={name ?? 'Avatar'} fill className="object-cover" sizes="56px" />
            </div>
        )
    }

    return (
        <div
            className={cn(
                'rounded-full bg-cosmic-brand text-white font-semibold flex items-center justify-center flex-shrink-0',
                sizeClass,
                className
            )}
            aria-label={name ?? 'User avatar'}
        >
            {getInitials(name)}
        </div>
    )
}
