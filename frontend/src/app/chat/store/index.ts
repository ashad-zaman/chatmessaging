import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Message, ConversationWithMeta, PresenceUpdate } from '@/types';
import { authApi, usersApi, conversationsApi, messagesApi } from '@/lib/api';
import { socketService, SocketEvent } from '@/lib/socket';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      
      login: async (email: string, password: string) => {
        const { accessToken, refreshToken } = await authApi.login({ email, password });
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        const user = await usersApi.getMe();
        set({ user, isAuthenticated: true, isLoading: false });
        
        socketService.connect(accessToken);
      },
      
      register: async (email: string, username: string, password: string, displayName?: string) => {
        const { accessToken, refreshToken } = await authApi.register({ email, username, password, displayName });
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        const user = await usersApi.getMe();
        set({ user, isAuthenticated: true, isLoading: false });
        
        socketService.connect(accessToken);
      },
      
      logout: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
          await authApi.logout(refreshToken || undefined);
        } catch {}
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        socketService.disconnect();
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
      
      checkAuth: async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          set({ isLoading: false });
          return;
        }
        
        try {
          const user = await usersApi.getMe();
          set({ user, isAuthenticated: true, isLoading: false });
          socketService.connect(accessToken);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);

interface ChatState {
  conversations: ConversationWithMeta[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>;
  onlineUsers: Set<string>;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  
  fetchConversations: () => Promise<void>;
  setActiveConversation: (conversationId: string | null) => void;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, clientMessageId: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessageStatus: (conversationId: string, messageId: string, status: string) => void;
  setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  updatePresence: (presence: PresenceUpdate) => void;
  markAsRead: (conversationId: string, messageId: string) => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  typingUsers: {},
  onlineUsers: new Set(),
  isLoadingConversations: false,
  isLoadingMessages: false,
  
  fetchConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const conversations = await conversationsApi.getConversations();
      set({ conversations, isLoadingConversations: false });
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      set({ isLoadingConversations: false });
    }
  },
  
  setActiveConversation: (conversationId: string | null) => {
    const currentActiveId = get().activeConversationId;
    if (currentActiveId && currentActiveId !== conversationId) {
      socketService.leaveConversation(currentActiveId);
    }
    
    set({ activeConversationId: conversationId });
    
    if (conversationId) {
      socketService.joinConversation(conversationId);
      get().fetchMessages(conversationId);
    }
  },
  
  fetchMessages: async (conversationId: string) => {
    set({ isLoadingMessages: true });
    try {
      const messagesData = await messagesApi.getMessages(conversationId);
      const messages = messagesData.map((m: any) => m.message);
      set((state) => ({
        messages: { ...state.messages, [conversationId]: messages },
        isLoadingMessages: false,
      }));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      set({ isLoadingMessages: false });
    }
  },
  
  sendMessage: (conversationId: string, content: string, clientMessageId: string) => {
    socketService.sendMessage({
      conversationId,
      content,
      clientMessageId,
    });
    
    const optimisticMessage: Message = {
      id: clientMessageId,
      conversationId,
      senderId: get().conversations[0]?.participants[0]?.id || '',
      content,
      type: 'text',
      status: 'pending',
      replyToId: null,
      attachmentId: null,
      clientMessageId,
      createdAt: new Date(),
      updatedAt: new Date(),
      sender: {} as any,
    };
    
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), optimisticMessage],
      },
    }));
  },
  
  addMessage: (conversationId: string, message: Message) => {
    set((state) => {
      const existingMessages = state.messages[conversationId] || [];
      const messageExists = existingMessages.some((m) => m.id === message.id);
      if (messageExists) return state;
      
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existingMessages, message],
        },
      };
    });
  },
  
  updateMessageStatus: (conversationId: string, messageId: string, status: string) => {
    set((state) => {
      const messages = state.messages[conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: messages.map((m) =>
            m.id === messageId || m.clientMessageId === messageId ? { ...m, status: status as any } : m
          ),
        },
      };
    });
  },
  
  setTyping: (conversationId: string, userId: string, isTyping: boolean) => {
    set((state) => {
      const currentTyping = state.typingUsers[conversationId] || [];
      const newTyping = isTyping
        ? [...new Set([...currentTyping, userId])]
        : currentTyping.filter((id) => id !== userId);
      
      return {
        typingUsers: { ...state.typingUsers, [conversationId]: newTyping },
      };
    });
  },
  
  startTyping: (conversationId: string) => {
    socketService.startTyping(conversationId);
  },
  
  stopTyping: (conversationId: string) => {
    socketService.stopTyping(conversationId);
  },
  
  updatePresence: (presence: PresenceUpdate) => {
    set((state) => {
      const newOnlineUsers = new Set(state.onlineUsers);
      if (presence.isOnline) {
        newOnlineUsers.add(presence.userId);
      } else {
        newOnlineUsers.delete(presence.userId);
      }
      return { onlineUsers: newOnlineUsers };
    });
  },
  
  markAsRead: async (conversationId: string, messageId: string) => {
    try {
      await messagesApi.markAsRead(conversationId, messageId);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  },
}));

socketService.on('receive_message', (message: Message) => {
  useChatStore.getState().addMessage(message.conversationId, message);
});

socketService.on('message_sent', (data: { serverMessageId: string; clientMessageId: string }) => {
  const state = useChatStore.getState();
  for (const conversationId of Object.keys(state.messages)) {
    state.updateMessageStatus(conversationId, data.clientMessageId, 'sent');
  }
});

socketService.on('typing_start', (data: { conversationId: string; userId: string }) => {
  useChatStore.getState().setTyping(data.conversationId, data.userId, true);
});

socketService.on('typing_stop', (data: { conversationId: string; userId: string }) => {
  useChatStore.getState().setTyping(data.conversationId, data.userId, false);
});

socketService.on('message_delivered', (data: { messageId: string; userId: string }) => {
  const state = useChatStore.getState();
  for (const conversationId of Object.keys(state.messages)) {
    state.updateMessageStatus(conversationId, data.messageId, 'delivered');
  }
});

socketService.on('message_read', (data: { messageId: string; userId: string }) => {
  const state = useChatStore.getState();
  for (const conversationId of Object.keys(state.messages)) {
    state.updateMessageStatus(conversationId, data.messageId, 'read');
  }
});

socketService.on('presence_update', (presence: PresenceUpdate) => {
  useChatStore.getState().updatePresence(presence);
});
