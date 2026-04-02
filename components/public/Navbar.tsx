// components/public/Navbar.tsx — IIMS IT Club Official Navbar (v4.0)
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/team', label: 'Team' },
    { href: '/events', label: 'Events' },
    { href: '/join', label: 'Join' }
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-[var(--color-cosmic-light)]',
            scrolled ? 'shadow-sm' : ''
        )}>
            <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Brand */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="group" aria-label="Home page">
                        <span className="font-bold text-cosmic-brand text-xl tracking-tight block leading-tight">
                            ICEHC
                        </span>
                        <span className="text-[#4A4A4A] text-xs font-medium tracking-wide block leading-tight mt-0.5">
                            IIMS College
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = pathname === href || (href !== '/' && pathname?.startsWith(href))

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'text-sm transition-all font-semibold py-2 relative group',
                                    active ? 'text-cosmic-brand' : 'text-[#4A4A4A] hover:text-cosmic-brand'
                                )}
                            >
                                {label}
                                {active && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cosmic-brand translate-y-2 rounded-sm" />
                                )}
                                {!active && (
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cosmic-brand translate-y-2 rounded-sm transition-all duration-300 group-hover:w-full opacity-50" />
                                )}
                            </Link>
                        )
                    })}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-cosmic-brand p-2 hover:bg-[var(--color-cosmic-light)] transition-colors rounded"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                >
                    {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </nav>

            {/* Mobile Nav Dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-white border-b border-[var(--color-cosmic-light)]">
                    <div className="flex flex-col px-6 py-4 space-y-2">
                        {NAV_LINKS.map(({ href, label }) => {
                            const active = pathname === href || (href !== '/' && pathname?.startsWith(href))
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMenuOpen(false)}
                                    className={cn(
                                        'text-base py-3 px-4 font-semibold border-l-4 transition-all',
                                        active
                                            ? 'text-cosmic-brand border-cosmic-brand bg-[var(--color-cosmic-light)]'
                                            : 'text-[#4A4A4A] border-transparent hover:text-cosmic-brand hover:bg-[var(--color-cosmic-light)]'
                                    )}
                                >
                                    {label}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
        </header>
    )
}
