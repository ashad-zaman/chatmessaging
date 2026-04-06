import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatController } from '@modules/chat/controllers/chat.controller';
import { ChatService } from '@modules/chat/services/chat.service';
import { ChatGateway } from '@modules/chat/gateways/chat.gateway';
import { Message } from '@domain/entities/message.entity';
import { Conversation } from '@domain/entities/conversation.entity';
import { ConversationParticipant } from '@domain/entities/conversation-participant.entity';
import { MessageReceipt } from '@domain/entities/message-receipt.entity';
import { ConversationsModule } from '@modules/conversations/conversations.module';
import { PresenceModule } from '@modules/presence/presence.module';
import { UsersModule } from '@modules/users/users.module';
import { RedisModule } from '@infrastructure/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      Conversation,
      ConversationParticipant,
      MessageReceipt,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret', 'your-super-secret-jwt-key-change-in-production'),
        signOptions: {
          expiresIn: configService.get('jwt.accessTokenExpiresIn', '15m'),
        },
      }),
    }),
    forwardRef(() => ConversationsModule),
    forwardRef(() => PresenceModule),
    UsersModule,
    RedisModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}
