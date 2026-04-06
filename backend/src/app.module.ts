import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import configuration from '@config/configuration';
import { LoggerModule } from '@common/logger/logger.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { ChatModule } from '@modules/chat/chat.module';
import { ConversationsModule } from '@modules/conversations/conversations.module';
import { PresenceModule } from '@modules/presence/presence.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { AttachmentsModule } from '@modules/attachments/attachments.module';
import { AdminModule } from '@modules/admin/admin.module';
import { HealthModule } from '@common/health/health.module';
import { RedisModule } from '@infrastructure/redis/redis.module';
import { SocketModule } from '@infrastructure/socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'chatmessaging'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
        extra: {
          pool_size: configService.get('DB_POOL_SIZE', 20),
        },
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          name: 'short',
          ttl: 1000,
          limit: 10,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 50,
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 200,
        },
      ],
    }),
    EventEmitterModule.forRoot(),
    LoggerModule,
    RedisModule,
    SocketModule,
    AuthModule,
    UsersModule,
    ChatModule,
    ConversationsModule,
    PresenceModule,
    NotificationsModule,
    AttachmentsModule,
    AdminModule,
    HealthModule,
  ],
})
export class AppModule {}
