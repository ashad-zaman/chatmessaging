import { Module, forwardRef } from '@nestjs/common';
import { PresenceService } from './services/presence.service';
import { RedisModule } from '@infrastructure/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [PresenceService],
  exports: [PresenceService],
})
export class PresenceModule {}
