import { Module, Global, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';
export const REDIS_PUBSLISHER = 'REDIS_PUBLISHER';

const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService) => {
    return new Redis({
      host: configService.get('redis.host', 'localhost'),
      port: configService.get('redis.port', 6379),
      password: configService.get('redis.password', ''),
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });
  },
  inject: [ConfigService],
};

const redisPublisherProvider: Provider = {
  provide: REDIS_PUBSLISHER,
  useFactory: (configService: ConfigService) => {
    return new Redis({
      host: configService.get('redis.host', 'localhost'),
      port: configService.get('redis.port', 6379),
      password: configService.get('redis.password', ''),
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [redisProvider, redisPublisherProvider],
  exports: [REDIS_CLIENT, REDIS_PUBSLISHER],
})
export class RedisModule {}
