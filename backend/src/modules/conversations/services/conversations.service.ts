import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Conversation, ConversationType } from '@domain/entities/conversation.entity';
import { ConversationParticipant } from '@domain/entities/conversation-participant.entity';
import { User } from '@domain/entities/user.entity';
import { Message } from '@domain/entities/message.entity';
import { CreateConversationDto } from '@modules/conversations/dto/create-conversation.dto';
import { GetConversationsDto } from '@modules/conversations/dto/get-conversations.dto';
import { Logger } from '@common/logger/logger';

export interface ConversationWithMeta {
  conversation: Conversation;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
}

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger('ConversationsService');

  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private readonly participantRepository: Repository<ConversationParticipant>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createDirectConversation(userId: string, otherUserId: string): Promise<Conversation> {
    if (userId === otherUserId) {
      throw new BadRequestException('Cannot create conversation with yourself');
    }

    const existingConversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation_participants', 'p1', 'p1.conversation_id = conversation.id AND p1.user_id = :userId1', { userId1: userId })
      .innerJoin('conversation_participants', 'p2', 'p2.conversation_id = conversation.id AND p2.user_id = :userId2', { userId2: otherUserId })
      .where('conversation.type = :type', { type: ConversationType.DIRECT })
      .getOne();

    if (existingConversation) {
      return existingConversation;
    }

    return this.createConversation({
      type: ConversationType.DIRECT,
      createdById: userId,
      participantIds: [userId, otherUserId],
    });
  }

  async createConversation(createDto: CreateConversationDto): Promise<Conversation> {
    const { type, name, avatarUrl, createdById, participantIds } = createDto;

    const conversation = this.conversationRepository.create({
      type,
      name: type === ConversationType.GROUP ? name || undefined : undefined,
      avatarUrl,
      createdById,
    });

    const savedConversation = await this.conversationRepository.save(conversation);

    const participants = participantIds.map((userId) =>
      this.participantRepository.create({
        conversationId: savedConversation.id,
        userId,
        unreadCount: 0,
      }),
    );

    await this.participantRepository.save(participants);
    this.logger.log(`Conversation created: ${savedConversation.id}`);

    return savedConversation;
  }

  async getUserConversations(
    userId: string,
    getConversationsDto: GetConversationsDto,
  ): Promise<ConversationWithMeta[]> {
    const { limit = 50, before } = getConversationsDto;

    const queryBuilder = this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation_participants', 'participant', 'participant.conversation_id = conversation.id AND participant.user_id = :userId', { userId })
      .leftJoinAndSelect('conversation.participants', 'allParticipants')
      .leftJoinAndSelect('allParticipants.user', 'user')
      .leftJoinAndSelect('conversation.lastMessage', 'lastMessage')
      .orderBy('conversation.lastMessageAt', 'DESC')
      .addOrderBy('conversation.updatedAt', 'DESC')
      .take(limit);

    if (before) {
      const existing = await this.conversationRepository.findOne({ where: { id: before } });
      if (existing) {
        queryBuilder.andWhere('conversation.lastMessageAt < :timestamp', {
          timestamp: existing.lastMessageAt,
        });
      }
    }

    const conversations = await queryBuilder.getMany();

    const participantUserIds = new Set<string>();
    conversations.forEach((conv) => {
      conv.participants?.forEach((p) => {
        if (p.user) participantUserIds.add(p.user.id);
      });
    });

    const userMap = new Map<string, User>();
    if (participantUserIds.size > 0) {
      const users = await this.participantRepository
        .createQueryBuilder('p')
        .innerJoinAndSelect('p.user', 'user')
        .where('p.userId IN (:...userIds)', { userIds: Array.from(participantUserIds) })
        .andWhere('p.conversationId IN (:...conversationIds)', {
          conversationIds: conversations.map((c) => c.id),
        })
        .getMany();

      userMap.set(userId, users.find((p) => p.userId === userId)?.user as User);
    }

    const result: ConversationWithMeta[] = await Promise.all(
      conversations.map(async (conversation) => {
        const participantUser = await this.participantRepository.findOne({
          where: { conversationId: conversation.id, userId },
          relations: ['user'],
        });

        return {
          conversation,
          participants: conversation.participants?.map((p) => p.user).filter(Boolean) || [],
          unreadCount: participantUser?.unreadCount || 0,
        };
      }),
    );

    return result;
  }

  async getConversationById(conversationId: string, userId: string): Promise<ConversationWithMeta> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['participants', 'participants.user'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isParticipant = conversation.participants.some((p) => p.userId === userId);
    if (!isParticipant) {
      throw new NotFoundException('Conversation not found');
    }

    const participantUser = await this.participantRepository.findOne({
      where: { conversationId, userId },
    });

    return {
      conversation,
      participants: conversation.participants?.map((p) => p.user).filter(Boolean) || [],
      unreadCount: participantUser?.unreadCount || 0,
    };
  }

  async getConversationParticipants(conversationId: string): Promise<ConversationParticipant[]> {
    return this.participantRepository.find({
      where: { conversationId },
      relations: ['user'],
    });
  }

  async updateLastMessage(conversationId: string, messageId: string): Promise<void> {
    await this.conversationRepository.update(conversationId, {
      lastMessageId: messageId,
      lastMessageAt: new Date(),
    });
  }

  async markAsRead(conversationId: string, userId: string, messageId: string): Promise<void> {
    await this.participantRepository.update(
      { conversationId, userId },
      { lastReadMessageId: messageId, unreadCount: 0 },
    );
  }

  async incrementUnreadCount(conversationId: string, userId: string): Promise<void> {
    await this.participantRepository.increment(
      { conversationId, userId },
      'unreadCount',
      1,
    );
  }

  async getUnreadCount(conversationId: string, userId: string): Promise<number> {
    const participant = await this.participantRepository.findOne({
      where: { conversationId, userId },
    });
    return participant?.unreadCount || 0;
  }
}
