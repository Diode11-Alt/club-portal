// components/Skeletons.tsx — Dimensionally accurate loading states
import { cn } from '@/lib/utils'

export function SkeletonMenu() {
    return (
        <div className="space-y-3">
            <div className="h-5 w-24 bg-cosmic-accent rounded-sm animate-pulse mb-4"></div>
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                    <div className="h-4 w-4 bg-cosmic-accent rounded-sm animate-pulse flex-shrink-0"></div>
                    <div className="h-4 w-32 bg-[var(--color-cosmic-light)] rounded-sm animate-pulse"></div>
                </div>
            ))}
        </div>
    )
}

export function SkeletonFeedPost() {
    return (
        <div className="bg-white border border-cosmic-accent rounded-sm p-5 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-cosmic-accent rounded-sm flex-shrink-0"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-cosmic-accent rounded-sm"></div>
                        <div className="h-3 w-20 bg-[var(--color-cosmic-light)] rounded-sm"></div>
                    </div>
                </div>
                <div className="h-6 w-16 bg-[var(--color-cosmic-light)] rounded-sm"></div>
            </div>
            <div className="space-y-3 mb-4">
                <div className="h-4 w-full bg-[var(--color-cosmic-light)] rounded-sm"></div>
                <div className="h-4 w-5/6 bg-[var(--color-cosmic-light)] rounded-sm"></div>
                <div className="h-4 w-4/6 bg-[var(--color-cosmic-light)] rounded-sm"></div>
            </div>
            <div className="flex gap-4 border-t border-[var(--color-cosmic-light)] pt-4">
                <div className="h-5 w-16 bg-[var(--color-cosmic-light)] rounded-sm"></div>
                <div className="h-5 w-16 bg-[var(--color-cosmic-light)] rounded-sm"></div>
            </div>
        </div>
    )
}

export function SkeletonFeedPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12 w-full">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3 animate-pulse">
                    <div className="h-6 w-24 bg-cosmic-accent rounded-sm"></div>
                    <div className="h-10 w-64 bg-cosmic-accent rounded-sm"></div>
                    <div className="h-4 w-96 bg-[var(--color-cosmic-light)] rounded-sm"></div>
                </div>
            </div>

            {/* Composer Skeleton */}
            <div className="bg-white border border-cosmic-accent rounded-sm p-5 animate-pulse">
                <div className="flex gap-4">
                    <div className="h-10 w-10 bg-cosmic-accent rounded-sm flex-shrink-0"></div>
                    <div className="h-10 flex-1 bg-[var(--color-cosmic-light)] rounded-sm"></div>
                </div>
            </div>

            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <SkeletonFeedPost key={i} />
                ))}
            </div>
        </div>
    )
}

export function SkeletonEventCard() {
    return (
        <div className="flex flex-col md:flex-row gap-6 bg-white border border-cosmic-accent p-6 rounded-sm animate-pulse">
            <div className="w-full md:w-48 h-32 bg-cosmic-accent rounded-sm flex-shrink-0"></div>
            <div className="flex-1 space-y-4 py-2">
                <div className="flex justify-between items-start mb-2">
                    <div className="h-6 w-48 bg-cosmic-accent rounded-sm"></div>
                    <div className="h-6 w-24 bg-cosmic-accent rounded-sm"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-full bg-[var(--color-cosmic-light)] rounded-sm"></div>
                    <div className="h-4 w-5/6 bg-[var(--color-cosmic-light)] rounded-sm"></div>
                </div>
                <div className="flex gap-6 pt-2">
                    <div className="h-4 w-24 bg-[var(--color-cosmic-light)] rounded-sm"></div>
                    <div className="h-4 w-24 bg-[var(--color-cosmic-light)] rounded-sm"></div>
                </div>
            </div>
        </div>
    )
}

export function SkeletonEventPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-pulse">
                <div className="space-y-3">
                    <div className="h-6 w-24 bg-cosmic-accent rounded-sm"></div>
                    <div className="h-10 w-64 bg-cosmic-accent rounded-sm"></div>
                    <div className="h-4 w-96 bg-[var(--color-cosmic-light)] rounded-sm"></div>
                </div>
                <div className="h-10 w-32 bg-cosmic-accent rounded-sm"></div>
            </div>
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <SkeletonEventCard key={i} />
                ))}
            </div>
        </div>
    )
}

export function SkeletonProfileHeader() {
    return (
        <div className="bg-white border text-center border-cosmic-accent p-8 rounded-sm animate-pulse flex flex-col items-center">
            <div className="w-24 h-24 rounded-sm bg-cosmic-accent mb-4"></div>
            <div className="h-6 w-48 bg-cosmic-accent rounded-sm mb-2"></div>
            <div className="h-4 w-32 bg-[var(--color-cosmic-light)] rounded-sm mb-6"></div>
            <div className="flex gap-4 w-full justify-center">
                <div className="h-10 w-32 bg-[var(--color-cosmic-light)] rounded-sm"></div>
                <div className="h-10 w-32 bg-[var(--color-cosmic-light)] rounded-sm"></div>
            </div>
        </div>
    )
}

export function GlobalPortalSkeletonShell() {
    return (
        <div className="w-full h-full min-h-[70vh] flex flex-col gap-6 animate-fade-in px-4 py-8">
            <div className="h-8 w-48 bg-cosmic-accent rounded-sm animate-pulse"></div>
            <div className="space-y-4">
                <div className="h-32 w-full bg-[var(--color-cosmic-light)] rounded-sm animate-pulse"></div>
                <div className="h-32 w-full bg-cosmic-accent rounded-sm animate-pulse"></div>
                <div className="h-32 w-full bg-[var(--color-cosmic-light)] rounded-sm animate-pulse"></div>
            </div>
        </div>
    )
}
