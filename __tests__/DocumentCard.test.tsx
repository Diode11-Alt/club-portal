// __tests__/DocumentCard.test.tsx — DocumentCard component render tests
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DocumentCard from '@/components/DocumentCard'

describe('DocumentCard', () => {
    const noop = vi.fn()

    const baseDoc = {
        id: 'doc-1',
        title: 'Cybersecurity Fundamentals',
        file_url: 'https://example.com/docs/cybersecurity.pdf',
        file_type: 'pdf' as const,
        uploaded_by: 'user-1',
        created_at: '2026-03-15T14:00:00Z',
        uploader: { name: 'Sangam Upreti', email: 'sangam@iims.edu.np' },
    }

    it('renders the document title', () => {
        render(<DocumentCard document={baseDoc} currentUserId={null} currentUserRole={null} onDelete={noop} />)
        expect(screen.getByText('Cybersecurity Fundamentals')).toBeTruthy()
    })

    it('renders the file type badge', () => {
        render(<DocumentCard document={baseDoc} currentUserId={null} currentUserRole={null} onDelete={noop} />)
        expect(screen.getByText('pdf')).toBeTruthy()
    })

    it('renders uploader name', () => {
        render(<DocumentCard document={baseDoc} currentUserId={null} currentUserRole={null} onDelete={noop} />)
        const allText = document.body.textContent || ''
        expect(allText).toContain('Sangam Upreti')
    })

    it('renders the download link', () => {
        render(<DocumentCard document={baseDoc} currentUserId={null} currentUserRole={null} onDelete={noop} />)
        const link = document.querySelector('a[href="https://example.com/docs/cybersecurity.pdf"]')
        expect(link).toBeTruthy()
    })

    it('renders date', () => {
        render(<DocumentCard document={baseDoc} currentUserId={null} currentUserRole={null} onDelete={noop} />)
        expect(screen.getByText(/Mar 15, 2026/)).toBeTruthy()
    })
})
