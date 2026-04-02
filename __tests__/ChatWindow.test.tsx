// __tests__/ChatWindow.test.tsx — ChatWindow component render tests
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ChatWindow from '@/components/portal/ChatWindow'

// Mock sonner
vi.mock('sonner', () => ({
    toast: { error: vi.fn(), success: vi.fn() },
}))

describe('ChatWindow', () => {
    const currentUser = {
        id: 'user-1',
        name: 'Sujal Mainali',
        avatar_url: null as string | null,
        role: 'admin' as const,
        club_post: 'President' as const,
    }

    const otherUser = {
        id: 'user-2',
        name: 'Sangam Upreti',
        avatar_url: null as string | null,
        role: 'member' as const,
        club_post: null,
    }

    const messages = [
        {
            id: 'msg-1',
            content: 'Hello Sangam!',
            sender_id: 'user-1',
            conversation_id: 'conv-1',
            created_at: '2026-03-01T10:00:00Z',
            is_deleted: false,
            attachment_url: null,
            attachment_type: null,
        },
        {
            id: 'msg-2',
            content: 'Hey Sujal, how are you?',
            sender_id: 'user-2',
            conversation_id: 'conv-1',
            created_at: '2026-03-01T10:01:00Z',
            is_deleted: false,
            attachment_url: null,
            attachment_type: null,
        },
    ]

    it('renders the other user name in header', () => {
        render(
            <ChatWindow
                initialMessages={messages}
                currentUser={currentUser}
                otherUser={otherUser}
                conversationId="conv-1"
            />
        )
        expect(screen.getByText('Sangam Upreti')).toBeTruthy()
    })

    it('renders all messages', () => {
        render(
            <ChatWindow
                initialMessages={messages}
                currentUser={currentUser}
                otherUser={otherUser}
                conversationId="conv-1"
            />
        )
        expect(screen.getByText('Hello Sangam!')).toBeTruthy()
        expect(screen.getByText('Hey Sujal, how are you?')).toBeTruthy()
    })

    it('renders the message input box', () => {
        render(
            <ChatWindow
                initialMessages={messages}
                currentUser={currentUser}
                otherUser={otherUser}
                conversationId="conv-1"
            />
        )
        const input = document.querySelector('input[type="text"], textarea')
        expect(input).toBeTruthy()
    })

    it('renders empty state with no messages', () => {
        render(
            <ChatWindow
                initialMessages={[]}
                currentUser={currentUser}
                otherUser={otherUser}
                conversationId="conv-1"
            />
        )
        // Should still render the header
        expect(screen.getByText('Sangam Upreti')).toBeTruthy()
    })
})
