import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@common/logger/logger';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger('NotificationsService');

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async sendNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      read: false,
      createdAt: new Date(),
    };

    this.logger.log(`Notification sent to user ${notification.userId}: ${notification.title}`);

    this.eventEmitter.emit('notification.created', newNotification);

    return newNotification;
  }

  async sendMessageNotification(
    recipientId: string,
    senderName: string,
    conversationId: string,
    messagePreview: string,
  ): Promise<Notification> {
    return this.sendNotification({
      userId: recipientId,
      type: 'new_message',
      title: 'New Message',
      message: `${senderName}: ${messagePreview}`,
      data: {
        conversationId,
      },
    });
  }

  async sendTypingNotification(
    recipientId: string,
    senderName: string,
    conversationId: string,
  ): Promise<Notification> {
    return this.sendNotification({
      userId: recipientId,
      type: 'typing',
      title: 'Typing',
      message: `${senderName} is typing...`,
      data: {
        conversationId,
      },
    });
  }

  async notifyOfflineUser(
    userId: string,
    notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>,
  ): Promise<void> {
    this.logger.log(`Queuing offline notification for user ${userId}`);
  }
}
