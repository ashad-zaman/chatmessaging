import { Module } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { NotificationsSubscriber } from './subscribers/notifications.subscriber';

@Module({
  providers: [NotificationsService, NotificationsSubscriber],
  exports: [NotificationsService],
})
export class NotificationsModule {}
