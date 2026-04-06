import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Message, MessageStatus, MessageType } from '@domain/entities/message.entity';
import { Conversation } from '@domain/entities/conversation.entity';
import { ConversationParticipant } from '@domain/entities/conversation-participant.entity';
import { MessageReceipt, ReceiptType } from '@domain/entities/message-receipt.entity';
import { SendMessageDto } from '@modules/chat/dto/send-message.dto';
import { GetMessagesDto } from '@modules/chat/dto/get-messages.dto';
import { ConversationsService } from '@modules/conversations/services/conversations.service';
import { Logger } from '@common/logger/logger';
import { Redis } from 'ioredis';

export interface MessageWithSender {
  message: Message;
  senderId: string;
  senderUsername: string;
  senderDisplayName: string;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger('ChatService');

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private readonly participantRepository: Repository<ConversationParticipant>,
    @InjectRepository(MessageReceipt)
    private readonly receiptRepository: Repository<MessageReceipt>,
    @Inject(forwardRef(() => ConversationsService))
    private readonly conversationsService: ConversationsService,
  ) {}

  async sendMessage(senderId: string, sendDto: SendMessageDto): Promise<Message> {
    const { conversationId, content, type, replyToId, attachmentId, clientMessageId } = sendDto;

    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const participant = await this.participantRepository.findOne({
      where: { conversationId, userId: senderId },
    });

    if (!participant) {
      throw new BadRequestException('User is not a participant of this conversation');
    }

    const message = this.messageRepository.create({
      conversationId,
      senderId,
      content,
      type: type || MessageType.TEXT,
      status: MessageStatus.PENDING,
      replyToId,
      attachmentId,
      clientMessageId,
    });

    const savedMessage = await this.messageRepository.save(message);

    await this.conversationsService.updateLastMessage(conversationId, savedMessage.id);

    const participants = await this.participantRepository.find({
      where: { conversationId },
    });

    for (const participant of participants) {
      if (participant.userId !== senderId) {
        await this.participantRepository.increment(
          { conversationId, userId: participant.userId },
          'unreadCount',
          1,
        );
      }
    }

    this.logger.log(`Message sent: ${savedMessage.id} by ${senderId}`);
    return savedMessage;
  }

  async getMessages(
    conversationId: string,
    userId: string,
    getMessagesDto: GetMessagesDto,
  ): Promise<MessageWithSender[]> {
    const { limit = 50, before, after } = getMessagesDto;

    const participant = await this.participantRepository.findOne({
      where: { conversationId, userId },
    });

    if (!participant) {
      throw new BadRequestException('User is not a participant of this conversation');
    }

    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .innerJoin('message.sender', 'sender')
      .select([
        'message',
        'sender.id',
        'sender.username',
        'sender.displayName',
      ])
      .where('message.conversationId = :conversationId', { conversationId })
      .orderBy('message.createdAt', 'DESC')
      .take(limit);

    if (before) {
      const beforeMessage = await this.messageRepository.findOne({ where: { id: before } });
      if (beforeMessage) {
        queryBuilder.andWhere('message.createdAt < :timestamp', {
          timestamp: beforeMessage.createdAt,
        });
      }
    }

    if (after) {
      const afterMessage = await this.messageRepository.findOne({ where: { id: after } });
      if (afterMessage) {
        queryBuilder.andWhere('message.createdAt > :timestamp', {
          timestamp: afterMessage.createdAt,
        });
      }
    }

    const messages = await queryBuilder.getMany();

    return messages.map((message) => ({
      message,
      senderId: message.sender.id,
      senderUsername: message.sender.username,
      senderDisplayName: message.sender.displayName,
    }));
  }

  async markMessageAsSent(messageId: string): Promise<void> {
    await this.messageRepository.update(messageId, { status: MessageStatus.SENT });
  }

  async markMessageAsDelivered(messageId: string, userId: string): Promise<void> {
    const existingReceipt = await this.receiptRepository.findOne({
      where: { messageId, userId, type: ReceiptType.DELIVERED },
    });

    if (!existingReceipt) {
      const receipt = this.receiptRepository.create({
        messageId,
        userId,
        type: ReceiptType.DELIVERED,
      });
      await this.receiptRepository.save(receipt);
    }

    const message = await this.messageRepository.findOne({ where: { id: messageId } });
    if (message && message.status === MessageStatus.SENT) {
      await this.messageRepository.update(messageId, { status: MessageStatus.DELIVERED });
    }
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    const existingReceipt = await this.receiptRepository.findOne({
      where: { messageId, userId, type: ReceiptType.READ },
    });

    if (!existingReceipt) {
      const receipt = this.receiptRepository.create({
        messageId,
        userId,
        type: ReceiptType.READ,
        readAt: new Date(),
      });
      await this.receiptRepository.save(receipt);
    }

    await this.messageRepository.update(messageId, { status: MessageStatus.READ });

    const message = await this.messageRepository.findOne({ where: { id: messageId } });
    if (message) {
      await this.conversationsService.markAsRead(message.conversationId, userId, messageId);
    }
  }

  async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    const participant = await this.participantRepository.findOne({
      where: { conversationId, userId },
    });

    if (!participant || !participant.lastReadMessageId) {
      return;
    }

    const lastReadMessage = await this.messageRepository.findOne({
      where: { id: participant.lastReadMessageId },
    });

    if (!lastReadMessage) {
      return;
    }

    await this.receiptRepository
      .createQueryBuilder()
      .update(MessageReceipt)
      .set({ type: ReceiptType.READ, readAt: new Date() })
      .where('messageId = :messageId', { messageId: lastReadMessage.id })
      .andWhere('userId = :userId', { userId })
      .execute();

    await this.messageRepository.update(
      { id: lastReadMessage.id },
      { status: MessageStatus.READ },
    );
  }

  async getMessageById(messageId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['sender'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async findMessageByClientId(clientMessageId: string, userId: string): Promise<Message | null> {
    return this.messageRepository.findOne({
      where: { clientMessageId, senderId: userId },
    });
  }
}
