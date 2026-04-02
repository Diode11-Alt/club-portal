// __tests__/PostCard.test.tsx — PostCard component render tests
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PostCard from '@/components/PostCard'

describe('PostCard', () => {
    const basePost = {
        id: 'post-1',
        title: 'Welcome to ICEHC',
        content: 'This is the first post on the club portal. We are excited!',
        author_id: 'user-1',
        pinned: false,
        created_at: '2026-03-01T10:00:00Z',
        author: { name: 'Sujal Mainali', email: 'sujal@iims.edu.np' },
    }

    const noop = vi.fn()

    it('renders the post title', () => {
        render(<PostCard post={basePost} currentUserId={null} currentUserRole={null} onDelete={noop} onEdit={noop} />)
        expect(screen.getByText('Welcome to ICEHC')).toBeTruthy()
    })

    it('renders the author name', () => {
        render(<PostCard post={basePost} currentUserId={null} currentUserRole={null} onDelete={noop} onEdit={noop} />)
        expect(screen.getByText('Sujal Mainali')).toBeTruthy()
    })

    it('renders pinned badge when pinned', () => {
        const pinnedPost = { ...basePost, pinned: true }
        render(<PostCard post={pinnedPost} currentUserId={null} currentUserRole={null} onDelete={noop} onEdit={noop} />)
        expect(screen.getByText('Pinned')).toBeTruthy()
    })

    it('renders content', () => {
        render(<PostCard post={basePost} currentUserId={null} currentUserRole={null} onDelete={noop} onEdit={noop} />)
        expect(screen.getByText(/first post on the club portal/)).toBeTruthy()
    })

    it('renders date', () => {
        render(<PostCard post={basePost} currentUserId={null} currentUserRole={null} onDelete={noop} onEdit={noop} />)
        expect(screen.getByText('Mar 1, 2026')).toBeTruthy()
    })
})
