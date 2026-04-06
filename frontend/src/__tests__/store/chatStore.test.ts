import { useAuthStore, useChatStore } from '@/app/chat/store';
import { authApi, usersApi } from '@/lib/api';

jest.mock('@/lib/api', () => ({
  authApi: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
  },
  usersApi: {
    getMe: jest.fn(),
    updateMe: jest.fn(),
    searchUsers: jest.fn(),
  },
  conversationsApi: {
    getConversations: jest.fn(),
    createConversation: jest.fn(),
    createDirectConversation: jest.fn(),
    getConversation: jest.fn(),
  },
  messagesApi: {
    getMessages: jest.fn(),
    sendMessage: jest.fn(),
    markAsRead: jest.fn(),
  },
}));

jest.mock('@/lib/socket', () => ({
  socketService: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    joinConversation: jest.fn(),
    leaveConversation: jest.fn(),
    sendMessage: jest.fn(),
    startTyping: jest.fn(),
    stopTyping: jest.fn(),
    on: jest.fn(() => jest.fn()),
    off: jest.fn(),
  },
}));

describe('AuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  describe('login', () => {
    it('should login user and set state', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        username: 'testuser',
        displayName: 'Test User',
        avatarUrl: null,
        role: 'user' as const,
        isEmailVerified: true,
        isOnline: false,
        lastSeenAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (authApi.login as jest.Mock).mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      (usersApi.getMe as jest.Mock).mockResolvedValue(mockUser);

      await useAuthStore.getState().login('test@test.com', 'password123');

      expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'access-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-token');
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('should throw error on invalid credentials', async () => {
      (authApi.login as jest.Mock).mockRejectedValue({
        response: { data: { message: 'Invalid credentials' } },
      });

      await expect(useAuthStore.getState().login('test@test.com', 'wrongpassword')).rejects.toEqual(
        expect.objectContaining({
          response: { data: { message: 'Invalid credentials' } },
        })
      );
    });
  });

  describe('register', () => {
    it('should register user and set state', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'new@test.com',
        username: 'newuser',
        displayName: 'New User',
        avatarUrl: null,
        role: 'user' as const,
        isEmailVerified: false,
        isOnline: false,
        lastSeenAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (authApi.register as jest.Mock).mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      (usersApi.getMe as jest.Mock).mockResolvedValue(mockUser);

      await useAuthStore.getState().register('new@test.com', 'newuser', 'password123', 'New User');

      expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'access-token');
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });

  describe('logout', () => {
    it('should logout user and clear state', async () => {
      (authApi.logout as jest.Mock).mockResolvedValue({});

      useAuthStore.setState({
        user: { id: 'user-1', email: 'test@test.com' } as any,
        isAuthenticated: true,
        isLoading: false,
      });

      await useAuthStore.getState().logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('should clear tokens even if logout API fails', async () => {
      (authApi.logout as jest.Mock).mockRejectedValue(new Error('Network error'));

      useAuthStore.setState({
        user: { id: 'user-1', email: 'test@test.com' } as any,
        isAuthenticated: true,
        isLoading: false,
      });

      await useAuthStore.getState().logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('checkAuth', () => {
    it('should authenticate user with valid token', async () => {
      const mockUser = { id: 'user-1', email: 'test@test.com', username: 'testuser' };
      (localStorage.getItem as jest.Mock).mockReturnValue('valid-token');
      (usersApi.getMe as jest.Mock).mockResolvedValue(mockUser);

      await useAuthStore.getState().checkAuth();

      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it('should not authenticate without token', async () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      await useAuthStore.getState().checkAuth();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it('should clear tokens and redirect on invalid token', async () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('invalid-token');
      (usersApi.getMe as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

      await useAuthStore.getState().checkAuth();

      expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});

describe('ChatStore', () => {
  const mockConversations = [
    {
      conversation: {
        id: 'conv-1',
        type: 'direct' as const,
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
          email: 'test@test.com',
          username: 'testuser',
          displayName: 'Test User',
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
        content: 'Hello',
        type: 'text' as const,
        status: 'sent' as const,
        replyToId: null,
        attachmentId: null,
        clientMessageId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        sender: {} as any,
      },
      unreadCount: 0,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useChatStore.setState({
      conversations: [],
      activeConversationId: null,
      messages: {},
      typingUsers: {},
      onlineUsers: new Set(),
      isLoadingConversations: false,
      isLoadingMessages: false,
    });
  });

  describe('fetchConversations', () => {
    it('should fetch and set conversations', async () => {
      const { conversationsApi } = require('@/lib/api');
      (conversationsApi.getConversations as jest.Mock).mockResolvedValue(mockConversations);

      await useChatStore.getState().fetchConversations();

      expect(useChatStore.getState().conversations).toEqual(mockConversations);
      expect(useChatStore.getState().isLoadingConversations).toBe(false);
    });

    it('should handle error on fetch failure', async () => {
      const { conversationsApi } = require('@/lib/api');
      (conversationsApi.getConversations as jest.Mock).mockRejectedValue(new Error('Network error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await useChatStore.getState().fetchConversations();

      expect(consoleSpy).toHaveBeenCalled();
      expect(useChatStore.getState().isLoadingConversations).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  describe('setActiveConversation', () => {
    it('should set active conversation and fetch messages', async () => {
      const { messagesApi } = require('@/lib/api');
      (messagesApi.getMessages as jest.Mock).mockResolvedValue([]);

      useChatStore.setState({ conversations: mockConversations });

      useChatStore.getState().setActiveConversation('conv-1');

      expect(useChatStore.getState().activeConversationId).toBe('conv-1');
      expect(messagesApi.getMessages).toHaveBeenCalledWith('conv-1');
    });

    it('should leave previous conversation when switching', async () => {
      const { socketService } = require('@/lib/socket');
      useChatStore.setState({ conversations: mockConversations, activeConversationId: 'conv-1' });

      useChatStore.getState().setActiveConversation('conv-2');

      expect(socketService.leaveConversation).toHaveBeenCalledWith('conv-1');
      expect(socketService.joinConversation).toHaveBeenCalledWith('conv-2');
    });

    it('should clear active conversation when null', () => {
      useChatStore.setState({ activeConversationId: 'conv-1' });

      useChatStore.getState().setActiveConversation(null);

      expect(useChatStore.getState().activeConversationId).toBeNull();
    });
  });

  describe('sendMessage', () => {
    it('should send message via socket and add optimistic message', () => {
      const { socketService } = require('@/lib/socket');
      useChatStore.setState({
        conversations: mockConversations,
        messages: {},
      });

      useChatStore.getState().sendMessage('conv-1', 'Hello World', 'temp-123');

      expect(socketService.sendMessage).toHaveBeenCalledWith({
        conversationId: 'conv-1',
        content: 'Hello World',
        clientMessageId: 'temp-123',
      });

      const messages = useChatStore.getState().messages['conv-1'];
      expect(messages.length).toBe(1);
      expect(messages[0].content).toBe('Hello World');
      expect(messages[0].status).toBe('pending');
    });
  });

  describe('addMessage', () => {
    it('should add message to conversation', () => {
      const newMessage = {
        id: 'msg-2',
        conversationId: 'conv-1',
        senderId: 'user-2',
        content: 'New message',
        type: 'text' as const,
        status: 'sent' as const,
        replyToId: null,
        attachmentId: null,
        clientMessageId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        sender: {} as any,
      };

      useChatStore.setState({ messages: { 'conv-1': [] } });

      useChatStore.getState().addMessage('conv-1', newMessage);

      expect(useChatStore.getState().messages['conv-1']).toHaveLength(1);
    });

    it('should not add duplicate message', () => {
      const existingMessage = {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-2',
        content: 'Existing',
        type: 'text' as const,
        status: 'sent' as const,
        replyToId: null,
        attachmentId: null,
        clientMessageId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        sender: {} as any,
      };

      useChatStore.setState({ messages: { 'conv-1': [existingMessage] } });

      useChatStore.getState().addMessage('conv-1', existingMessage);

      expect(useChatStore.getState().messages['conv-1']).toHaveLength(1);
    });
  });

  describe('updateMessageStatus', () => {
    it('should update message status by id', () => {
      const message = {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-1',
        content: 'Test',
        type: 'text' as const,
        status: 'pending' as const,
        replyToId: null,
        attachmentId: null,
        clientMessageId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        sender: {} as any,
      };

      useChatStore.setState({ messages: { 'conv-1': [message] } });

      useChatStore.getState().updateMessageStatus('conv-1', 'msg-1', 'sent');

      expect(useChatStore.getState().messages['conv-1'][0].status).toBe('sent');
    });

    it('should update message status by clientMessageId', () => {
      const message = {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-1',
        content: 'Test',
        type: 'text' as const,
        status: 'pending' as const,
        replyToId: null,
        attachmentId: null,
        clientMessageId: 'temp-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        sender: {} as any,
      };

      useChatStore.setState({ messages: { 'conv-1': [message] } });

      useChatStore.getState().updateMessageStatus('conv-1', 'temp-123', 'sent');

      expect(useChatStore.getState().messages['conv-1'][0].status).toBe('sent');
    });
  });

  describe('setTyping', () => {
    it('should add user to typing list', () => {
      useChatStore.setState({ typingUsers: { 'conv-1': [] } });

      useChatStore.getState().setTyping('conv-1', 'user-2', true);

      expect(useChatStore.getState().typingUsers['conv-1']).toContain('user-2');
    });

    it('should remove user from typing list', () => {
      useChatStore.setState({ typingUsers: { 'conv-1': ['user-2', 'user-3'] } });

      useChatStore.getState().setTyping('conv-1', 'user-2', false);

      expect(useChatStore.getState().typingUsers['conv-1']).not.toContain('user-2');
      expect(useChatStore.getState().typingUsers['conv-1']).toContain('user-3');
    });
  });

  describe('updatePresence', () => {
    it('should add user to online users', () => {
      useChatStore.setState({ onlineUsers: new Set() });

      useChatStore.getState().updatePresence({
        userId: 'user-2',
        isOnline: true,
      });

      expect(useChatStore.getState().onlineUsers.has('user-2')).toBe(true);
    });

    it('should remove user from online users', () => {
      useChatStore.setState({ onlineUsers: new Set(['user-2', 'user-3']) });

      useChatStore.getState().updatePresence({
        userId: 'user-2',
        isOnline: false,
      });

      expect(useChatStore.getState().onlineUsers.has('user-2')).toBe(false);
      expect(useChatStore.getState().onlineUsers.has('user-3')).toBe(true);
    });
  });

  describe('markAsRead', () => {
    it('should call API to mark message as read', async () => {
      const { messagesApi } = require('@/lib/api');
      (messagesApi.markAsRead as jest.Mock).mockResolvedValue({});

      await useChatStore.getState().markAsRead('conv-1', 'msg-1');

      expect(messagesApi.markAsRead).toHaveBeenCalledWith('conv-1', 'msg-1');
    });

    it('should handle error silently', async () => {
      const { messagesApi } = require('@/lib/api');
      (messagesApi.markAsRead as jest.Mock).mockRejectedValue(new Error('Network error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await useChatStore.getState().markAsRead('conv-1', 'msg-1');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});