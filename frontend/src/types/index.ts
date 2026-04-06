export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  isOnline: boolean;
  lastSeenAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string | null;
  avatarUrl: string | null;
  lastMessageId: string | null;
  lastMessageAt: Date | null;
  createdById: string;
  participants: ConversationParticipant[];
}

export interface ConversationParticipant {
  id: string;
  userId: string;
  conversationId: string;
  lastReadMessageId: string | null;
  unreadCount: number;
  isMuted: boolean;
  user: User;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  status: 'pending' | 'sent' | 'delivered' | 'read';
  replyToId: string | null;
  attachmentId: string | null;
  clientMessageId: string | null;
  createdAt: Date;
  updatedAt: Date;
  sender: User;
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  type: 'image' | 'file' | 'audio' | 'video';
  uploadedById: string;
  createdAt: Date;
}

export interface ConversationWithMeta {
  conversation: Conversation;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface MessageWithSender {
  message: Message;
  senderId: string;
  senderUsername: string;
  senderDisplayName: string;
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface PresenceUpdate {
  userId: string;
  isOnline: boolean;
  lastSeenAt?: Date;
}
