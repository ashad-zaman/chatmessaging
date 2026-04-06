import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@common/logger/logger';
import { ChatService } from '@modules/chat/services/chat.service';
import { ConversationsService } from '@modules/conversations/services/conversations.service';
import { PresenceService } from '@modules/presence/services/presence.service';
import { UsersService } from '@modules/users/services/users.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  conversationId?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('ChatGateway');
  private activeUsers: Map<string, string> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly chatService: ChatService,
    private readonly conversationsService: ConversationsService,
    private readonly presenceService: PresenceService,
    private readonly usersService: UsersService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn('WebSocket connection attempt without token');
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt.secret'),
      });

      if (!payload.sub) {
        client.disconnect();
        return;
      }

      client.userId = payload.sub;
      await this.usersService.updateOnlineStatus(payload.sub, true);
      await this.presenceService.setUserOnline(payload.sub);

      this.activeUsers.set(client.id, payload.sub);
      this.logger.log(`User connected: ${payload.sub} (${client.id})`);

      client.emit('authenticated', { userId: payload.sub });
      client.emit('presence_update', {
        userId: payload.sub,
        isOnline: true,
      });
    } catch (error) {
      this.logger.error('WebSocket authentication failed', error.stack);
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    const userId = this.activeUsers.get(client.id);
    if (userId) {
      await this.usersService.updateOnlineStatus(userId, false);
      await this.presenceService.setUserOffline(userId);
      this.activeUsers.delete(client.id);
      this.logger.log(`User disconnected: ${userId}`);

      this.server.emit('presence_update', {
        userId,
        isOnline: false,
        lastSeenAt: new Date(),
      });
    }
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: {
      conversationId: string;
      content: string;
      type?: string;
      clientMessageId?: string;
      replyToId?: string;
      attachmentId?: string;
    },
  ) {
    if (!client.userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const message = await this.chatService.sendMessage(client.userId, {
      conversationId: data.conversationId,
      content: data.content,
      type: data.type as any,
      clientMessageId: data.clientMessageId,
      replyToId: data.replyToId,
      attachmentId: data.attachmentId,
    });

    await this.chatService.markMessageAsSent(message.id);

    const sender = await this.usersService.findById(client.userId);

    const messagePayload = {
      ...message,
      senderId: client.userId,
      senderUsername: sender.username,
      senderDisplayName: sender.displayName,
    };

    this.server.to(`conversation:${data.conversationId}`).emit('receive_message', messagePayload);

    this.server.to(`conversation:${data.conversationId}`).emit('message_sent', {
      serverMessageId: message.id,
      clientMessageId: data.clientMessageId,
    });

    return { serverMessageId: message.id };
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!client.userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const conv = await this.conversationsService.getConversationById(data.conversationId, client.userId);
    
    if (client.conversationId) {
      client.leave(`conversation:${client.conversationId}`);
    }

    client.join(`conversation:${data.conversationId}`);
    client.conversationId = data.conversationId;

    this.logger.log(`User ${client.userId} joined conversation ${data.conversationId}`);

    return { success: true };
  }

  @SubscribeMessage('leave_conversation')
  async handleLeaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!client.userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    client.leave(`conversation:${data.conversationId}`);
    this.logger.log(`User ${client.userId} left conversation ${data.conversationId}`);

    return { success: true };
  }

  @SubscribeMessage('typing_start')
  async handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!client.userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    client.to(`conversation:${data.conversationId}`).emit('typing_start', {
      conversationId: data.conversationId,
      userId: client.userId,
    });
  }

  @SubscribeMessage('typing_stop')
  async handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!client.userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    client.to(`conversation:${data.conversationId}`).emit('typing_stop', {
      conversationId: data.conversationId,
      userId: client.userId,
    });
  }

  @SubscribeMessage('message_delivered')
  async handleMessageDelivered(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { messageId: string },
  ) {
    if (!client.userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    await this.chatService.markMessageAsDelivered(data.messageId, client.userId);

    const message = await this.chatService.getMessageById(data.messageId);
    
    this.server.to(`conversation:${message.conversationId}`).emit('message_delivered', {
      messageId: data.messageId,
      userId: client.userId,
      status: 'delivered',
    });
  }

  @SubscribeMessage('message_read')
  async handleMessageRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { messageId: string; conversationId: string },
  ) {
    if (!client.userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    await this.chatService.markMessageAsRead(data.messageId, client.userId);

    this.server.to(`conversation:${data.conversationId}`).emit('message_read', {
      messageId: data.messageId,
      userId: client.userId,
      status: 'read',
    });
  }

  broadcastToConversation(conversationId: string, event: string, data: any) {
    this.server.to(`conversation:${conversationId}`).emit(event, data);
  }
}
