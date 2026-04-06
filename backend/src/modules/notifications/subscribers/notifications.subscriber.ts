import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@common/logger/logger';
import { NotificationsService, Notification } from '../services/notifications.service';

@Injectable()
export class NotificationsSubscriber {
  private readonly logger = new Logger('NotificationsSubscriber');

  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('notification.created')
  handleNotificationCreated(notification: Notification) {
    this.logger.log(`Handling notification: ${notification.id}`);
  }

  @OnEvent('message.received')
  handleMessageReceived(payload: {
    recipientId: string;
    senderName: string;
    conversationId: string;
    messagePreview: string;
  }) {
    this.notificationsService.sendMessageNotification(
      payload.recipientId,
      payload.senderName,
      payload.conversationId,
      payload.messagePreview,
    );
  }

  @OnEvent('message.read')
  handleMessageRead(payload: {
    recipientId: string;
    senderId: string;
    conversationId: string;
  }) {
    this.logger.log(`Message read by ${payload.senderId} in conversation ${payload.conversationId}`);
  }
}
