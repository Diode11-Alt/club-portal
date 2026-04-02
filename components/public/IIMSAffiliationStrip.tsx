// components/public/IIMSAffiliationStrip.tsx — IIMS IT Club Affiliation Banner (v4.0)
import { ExternalLink } from 'lucide-react'
import { BRAND } from '@/lib/brand'

export default function IIMSAffiliationStrip() {
    return (
        <div className="bg-[#7F0000] text-white py-2 px-4 flex items-center justify-center text-xs font-medium z-50 relative">
            <span className="opacity-90 mr-2 hidden sm:inline">Official cybersecurity club of</span>
            <span className="font-bold flex items-center gap-1.5 hover:text-cosmic-black transition-colors cursor-pointer">
                <a
                    href={BRAND.collegeURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                >
                    IIMS College, Kathmandu <ExternalLink className="h-3 w-3 opacity-75" />
                </a>
            </span>
        </div>
    )
}
