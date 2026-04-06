import { io, Socket } from 'socket.io-client';
import { PresenceUpdate, Message } from '@/types';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000/chat';

export type SocketEvent =
  | 'connect'
  | 'disconnect'
  | 'authenticated'
  | 'error'
  | 'receive_message'
  | 'message_sent'
  | 'typing_start'
  | 'typing_stop'
  | 'message_delivered'
  | 'message_read'
  | 'presence_update'
  | 'conversation_updated';

export interface ServerToClientEvents {
  authenticated: (data: { userId: string }) => void;
  error: (data: { code: string; message: string }) => void;
  receive_message: (message: Message) => void;
  message_sent: (data: { serverMessageId: string; clientMessageId?: string }) => void;
  typing_start: (data: { conversationId: string; userId: string }) => void;
  typing_stop: (data: { conversationId: string; userId: string }) => void;
  message_delivered: (data: { messageId: string; userId: string; status: string }) => void;
  message_read: (data: { messageId: string; userId: string; status: string }) => void;
  presence_update: (data: PresenceUpdate) => void;
  conversation_updated: (data: { conversationId: string }) => void;
}

export interface ClientToServerEvents {
  send_message: (data: {
    conversationId: string;
    content: string;
    type?: string;
    clientMessageId?: string;
    replyToId?: string;
    attachmentId?: string;
  }) => void;
  join_conversation: (data: { conversationId: string }) => void;
  leave_conversation: (data: { conversationId: string }) => void;
  typing_start: (data: { conversationId: string }) => void;
  typing_stop: (data: { conversationId: string }) => void;
  message_delivered: (data: { messageId: string }) => void;
  message_read: (data: { messageId: string; conversationId: string }) => void;
}

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private eventHandlers: Map<string, Set<(...args: any[]) => void>> = new Map();

  connect(token: string): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
      this.emit('connect', {});
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.emit('disconnect', { reason });
    });

    this.socket.on('authenticated', (data) => {
      this.emit('authenticated', data);
    });

    this.socket.on('error', (data) => {
      console.error('Socket error:', data);
      this.emit('error', data);
    });

    this.socket.on('receive_message', (message) => {
      this.emit('receive_message', message);
    });

    this.socket.on('message_sent', (data) => {
      this.emit('message_sent', data);
    });

    this.socket.on('typing_start', (data) => {
      this.emit('typing_start', data);
    });

    this.socket.on('typing_stop', (data) => {
      this.emit('typing_stop', data);
    });

    this.socket.on('message_delivered', (data) => {
      this.emit('message_delivered', data);
    });

    this.socket.on('message_read', (data) => {
      this.emit('message_read', data);
    });

    this.socket.on('presence_update', (data) => {
      this.emit('presence_update', data);
    });

    this.socket.on('conversation_updated', (data) => {
      this.emit('conversation_updated', data);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  on(event: SocketEvent, handler: (...args: any[]) => void): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);

    return () => {
      this.eventHandlers.get(event)?.delete(handler);
    };
  }

  off(event: SocketEvent, handler: (...args: any[]) => void): void {
    this.eventHandlers.get(event)?.delete(handler);
  }

  private emit(event: SocketEvent, data: any): void {
    this.eventHandlers.get(event)?.forEach((handler) => {
      handler(data);
    });
  }

  joinConversation(conversationId: string): void {
    this.socket?.emit('join_conversation', { conversationId });
  }

  leaveConversation(conversationId: string): void {
    this.socket?.emit('leave_conversation', { conversationId });
  }

  sendMessage(data: {
    conversationId: string;
    content: string;
    type?: string;
    clientMessageId?: string;
    replyToId?: string;
    attachmentId?: string;
  }): void {
    this.socket?.emit('send_message', data);
  }

  startTyping(conversationId: string): void {
    this.socket?.emit('typing_start', { conversationId });
  }

  stopTyping(conversationId: string): void {
    this.socket?.emit('typing_stop', { conversationId });
  }

  markMessageDelivered(messageId: string): void {
    this.socket?.emit('message_delivered', { messageId });
  }

  markMessageRead(messageId: string, conversationId: string): void {
    this.socket?.emit('message_read', { messageId, conversationId });
  }
}

export const socketService = new SocketService();
