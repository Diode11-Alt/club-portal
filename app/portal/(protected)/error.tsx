'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function PortalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8 text-center bg-white rounded-sm border border-cosmic-accent shadow-sm animate-fade-up">
            <div className="h-16 w-16 bg-cosmic-brand/10 rounded-sm flex items-center justify-center mb-6">
                <AlertCircle className="h-8 w-8 text-cosmic-brand" />
            </div>
            <h2 className="text-2xl font-bold text-cosmic-black mb-2">Something went wrong</h2>
            <p className="text-cosmic-accent max-w-md mb-8">
                The portal encountered a temporary issue while loading this section. Please try again.
            </p>
            <button
                onClick={() => reset()}
                className="inline-flex items-center gap-2 bg-cosmic-brand text-white px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-cosmic-dark transition-colors shadow-sm focus:ring-4 focus:ring-cosmic-brand/20 outline-none"
            >
                <RefreshCw className="h-4 w-4" />
                Try Again
            </button>
        </div>
    )
}
