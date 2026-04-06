import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConversationItem } from '@/components/chat/ConversationItem';
import { ConversationWithMeta } from '@/types';

const mockConversation: ConversationWithMeta = {
  conversation: {
    id: 'conv-1',
    type: 'direct' as const,
    name: null,
    avatarUrl: null,
    lastMessageId: 'msg-1',
    lastMessageAt: new Date('2024-01-15T10:30:00'),
    createdById: 'user-1',
    participants: [],
  },
  participants: [
    {
      id: 'user-2',
      email: 'john@test.com',
      username: 'johndoe',
      displayName: 'John Doe',
      avatarUrl: null,
      role: 'user' as const,
      isEmailVerified: true,
      isOnline: true,
      lastSeenAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  lastMessage: {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Hello there!',
    type: 'text' as const,
    status: 'read' as const,
    replyToId: null,
    attachmentId: null,
    clientMessageId: null,
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    sender: {
      id: 'user-1',
      email: 'me@test.com',
      username: 'me',
      displayName: 'Me',
      avatarUrl: null,
      role: 'user' as const,
      isEmailVerified: true,
      isOnline: false,
      lastSeenAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  unreadCount: 3,
};

describe('ConversationItem', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders conversation display name', () => {
    render(
      <ConversationItem
        conversation={mockConversation}
        isActive={false}
        onClick={mockOnClick}
        currentUserId="user-1"
      />
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders last message content', () => {
    render(
      <ConversationItem
        conversation={mockConversation}
        isActive={false}
        onClick={mockOnClick}
        currentUserId="user-1"
      />
    );
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
  });

  it('renders timestamp in HH:mm format', () => {
    render(
      <ConversationItem
        conversation={mockConversation}
        isActive={false}
        onClick={mockOnClick}
        currentUserId="user-1"
      />
    );
    expect(screen.getByText('10:30')).toBeInTheDocument();
  });

  it('renders unread count badge when unreadCount > 0', () => {
    render(
      <ConversationItem
        conversation={mockConversation}
        isActive={false}
        onClick={mockOnClick}
        currentUserId="user-1"
      />
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not render badge when unreadCount is 0', () => {
    const noUnreadConversation = {
      ...mockConversation,
      unreadCount: 0,
    };
    render(
      <ConversationItem
        conversation={noUnreadConversation}
        isActive={false}
        onClick={mockOnClick}
        currentUserId="user-1"
      />
    );
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('displays "No messages yet" when lastMessage is null', () => {
    const noMessagesConversation = {
      ...mockConversation,
      lastMessage: undefined,
    };
    render(
      <ConversationItem
        conversation={noMessagesConversation}
        isActive={false}
        onClick={mockOnClick}
        currentUserId="user-1"
      />
    );
    expect(screen.getByText('No messages yet')).toBeInTheDocument();
  });

  it('shows avatar with first letter when no avatarUrl', () => {
    render(
      <ConversationItem
        conversation={mockConversation}
        isActive={false}
        onClick={mockOnClick}
        currentUserId="user-1"
      />
    );
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('shows avatar image when avatarUrl exists', () => {
    const withAvatarConversation = {
      ...mockConversation,
      conversation: {
        ...mockConversation.conversation,
        avatarUrl: 'https://example.com/avatar.jpg',
      },
    };
    const { container } = render(
      <ConversationItem
        conversation={withAvatarConversation}
        isActive={false}
        onClick={mockOnClick}
        currentUserId="user-1"
      />
    );
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('calls onClick when clicked', () => {
    render(
      <ConversationItem
        conversation={mockConversation}
        isActive={false}
        onClick={mockOnClick}
        currentUserId="user-1"
      />
    );
    fireEvent.click(screen.getByText('John Doe'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies active styles when isActive is true', () => {
    render(
      <ConversationItem
        conversation={mockConversation}
        isActive={true}
        onClick={mockOnClick}
        currentUserId="user-1"
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-50');
    expect(button).toHaveClass('border-r-4');
    expect(button).toHaveClass('border-blue-600');
  });

  it('shows group name when conversation has a name', () => {
    const groupConversation = {
      ...mockConversation,
      conversation: {
        ...mockConversation.conversation,
        name: 'Test Group',
      },
    };
    render(
      <ConversationItem
        conversation={groupConversation}
        isActive={false}
        onClick={mockOnClick}
        currentUserId="user-1"
      />
    );
    expect(screen.getByText('Test Group')).toBeInTheDocument();
  });

  it('shows multiple participant names for group conversations', () => {
    const groupConversation: ConversationWithMeta = {
      conversation: {
        id: 'conv-1',
        type: 'group' as const,
        name: null,
        avatarUrl: null,
        lastMessageId: 'msg-1',
        lastMessageAt: new Date(),
        createdById: 'user-1',
        participants: [],
      },
      participants: [
        {
          id: 'user-2',
          email: 'a@test.com',
          username: 'alice',
          displayName: 'Alice',
          avatarUrl: null,
          role: 'user' as const,
          isEmailVerified: true,
          isOnline: false,
          lastSeenAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'user-3',
          email: 'b@test.com',
          username: 'bob',
          displayName: 'Bob',
          avatarUrl: null,
          role: 'user' as const,
          isEmailVerified: true,
          isOnline: false,
          lastSeenAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      lastMessage: undefined,
      unreadCount: 0,
    };
    render(
      <ConversationItem
        conversation={groupConversation}
        isActive={false}
        onClick={mockOnClick}
        currentUserId="user-1"
      />
    );
    expect(screen.getByText('Alice, Bob')).toBeInTheDocument();
  });
});