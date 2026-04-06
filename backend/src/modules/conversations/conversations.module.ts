import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsController } from '@modules/conversations/controllers/conversations.controller';
import { ConversationsService } from '@modules/conversations/services/conversations.service';
import { Conversation } from '@domain/entities/conversation.entity';
import { ConversationParticipant } from '@domain/entities/conversation-participant.entity';
import { Message } from '@domain/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, ConversationParticipant, Message]),
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
