'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useChatStore } from '@/app/chat/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { ConversationItem } from '@/components/chat/ConversationItem';
import { MessageBubble, TypingIndicator } from '@/components/chat/MessageBubble';
import { MessageInput } from '@/components/chat/MessageInput';
import { MessageCircle, Search } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const {
    conversations,
    activeConversationId,
    messages,
    typingUsers,
    onlineUsers,
    isLoadingConversations,
    setActiveConversation,
    fetchConversations,
  } = useChatStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activeConversation = conversations.find(
    (c) => c.conversation.id === activeConversationId
  );
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const typingInConversation = activeConversationId
    ? typingUsers[activeConversationId] || []
    : [];

  const otherParticipants = activeConversation?.participants.filter(
    (p) => p.id !== user?.id
  );
  const chatTitle = activeConversation?.conversation.name ||
    otherParticipants?.map((p) => p.displayName || p.username).join(', ') ||
    'Select a conversation';

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex">
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoadingConversations ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations yet
              </div>
            ) : (
              conversations.map((conv) => (
                <ConversationItem
                  key={conv.conversation.id}
                  conversation={conv}
                  isActive={conv.conversation.id === activeConversationId}
                  onClick={() => setActiveConversation(conv.conversation.id)}
                  currentUserId={user?.id || ''}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-gray-50">
          {activeConversationId ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-white">
                <h2 className="text-lg font-semibold">{chatTitle}</h2>
                <div className="flex gap-2 mt-1">
                  {otherParticipants?.map((p) => (
                    <span
                      key={p.id}
                      className={`text-sm ${
                        onlineUsers.has(p.id) ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {onlineUsers.has(p.id) ? 'Online' : `Last seen ${p.lastSeenAt}`}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {activeMessages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {typingInConversation.length > 0 && (
                  <div className="mt-2">
                    <TypingIndicator userName={typingInConversation[0]} />
                  </div>
                )}
              </div>

              <MessageInput conversationId={activeConversationId} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">
                  Select a conversation
                </h2>
                <p className="text-gray-500 mt-2">
                  Choose a conversation from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
