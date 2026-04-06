import React from 'react';
import { render, screen } from '@testing-library/react';
import { MessageBubble, TypingIndicator } from '@/components/chat/MessageBubble';
import { Message } from '@/types';

jest.mock('@/app/chat/store', () => ({
  useAuthStore: jest.fn(() => ({
    user: { id: 'user-1', email: 'test@test.com', username: 'testuser' },
  })),
}));

describe('MessageBubble', () => {
  const mockMessage: Message = {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Hello, world!',
    type: 'text',
    status: 'sent',
    replyToId: null,
    attachmentId: null,
    clientMessageId: null,
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    sender: {
      id: 'user-1',
      email: 'test@test.com',
      username: 'testuser',
      displayName: 'Test User',
      avatarUrl: null,
      role: 'user',
      isEmailVerified: true,
      isOnline: false,
      lastSeenAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  it('renders message content', () => {
    render(<MessageBubble message={mockMessage} />);
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('renders timestamp in HH:mm format', () => {
    render(<MessageBubble message={mockMessage} />);
    expect(screen.getByText('10:30')).toBeInTheDocument();
  });

  it('aligns own message to the right', () => {
    const { container } = render(<MessageBubble message={mockMessage} />);
    const bubble = container.firstChild as HTMLElement;
    expect(bubble).toHaveClass('justify-end');
  });

  it('aligns other message to the left', () => {
    const otherMessage = { ...mockMessage, senderId: 'user-2' };
    const { container } = render(<MessageBubble message={otherMessage} />);
    const bubble = container.firstChild as HTMLElement;
    expect(bubble).toHaveClass('justify-start');
  });

  it('shows clock icon for pending status', () => {
    const pendingMessage = { ...mockMessage, status: 'pending' as const };
    render(<MessageBubble message={pendingMessage} />);
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
  });

  it('shows check icon for sent status', () => {
    render(<MessageBubble message={mockMessage} />);
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('shows double check for delivered status', () => {
    const deliveredMessage = { ...mockMessage, status: 'delivered' as const };
    render(<MessageBubble message={deliveredMessage} />);
    expect(screen.getByTestId('checkcheck-icon')).toBeInTheDocument();
  });

  it('shows blue double check for read status', () => {
    const readMessage = { ...mockMessage, status: 'read' as const };
    render(<MessageBubble message={readMessage} />);
    const icon = screen.getByTestId('checkcheck-icon');
    expect(icon).toHaveClass('text-blue-500');
  });

  it('handles long message with word wrap', () => {
    const longMessage = { ...mockMessage, content: 'A'.repeat(500) };
    const { container } = render(<MessageBubble message={longMessage} />);
    const paragraph = screen.getByText(/^A+$/);
    expect(paragraph).toHaveClass('break-words');
  });

  it('does not show status icon for other user messages', () => {
    const otherMessage = { ...mockMessage, senderId: 'user-2' };
    render(<MessageBubble message={otherMessage} />);
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });
});

describe('TypingIndicator', () => {
  it('renders user name and typing text', () => {
    render(<TypingIndicator userName="John" />);
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('is typing')).toBeInTheDocument();
  });

  it('renders three bouncing dots', () => {
    const { container } = render(<TypingIndicator userName="John" />);
    const dots = container.querySelectorAll('.animate-bounce');
    expect(dots).toHaveLength(3);
  });

  it('dots have correct animation delays', () => {
    const { container } = render(<TypingIndicator userName="John" />);
    const dots = container.querySelectorAll('.animate-bounce');
    expect(dots[0]).toHaveStyle('animation-delay: 0ms');
    expect(dots[1]).toHaveStyle('animation-delay: 150ms');
    expect(dots[2]).toHaveStyle('animation-delay: 300ms');
  });
});