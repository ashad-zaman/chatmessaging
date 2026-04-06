import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@domain/entities/user.entity';
import { Message } from '@domain/entities/message.entity';
import { Conversation } from '@domain/entities/conversation.entity';
import { Logger } from '@common/logger/logger';

export interface AdminStats {
  totalUsers: number;
  totalMessages: number;
  totalConversations: number;
  onlineUsers: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  database: boolean;
  redis: boolean;
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger('AdminService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async getStats(): Promise<AdminStats> {
    const [totalUsers, totalMessages, totalConversations, onlineUsers] = await Promise.all([
      this.userRepository.count(),
      this.messageRepository.count(),
      this.conversationRepository.count(),
      this.userRepository.count({ where: { isOnline: true } }),
    ]);

    return {
      totalUsers,
      totalMessages,
      totalConversations,
      onlineUsers,
    };
  }

  async getSystemHealth(): Promise<SystemHealth> {
    let databaseHealthy = false;
    let redisHealthy = false;

    try {
      await this.userRepository.query('SELECT 1');
      databaseHealthy = true;
    } catch {
      this.logger.error('Database health check failed');
    }

    try {
      const { REDIS_CLIENT } = await import('@infrastructure/redis/redis.module');
      redisHealthy = true;
    } catch {
      this.logger.error('Redis health check failed');
    }

    const status = databaseHealthy && redisHealthy ? 'healthy' : databaseHealthy ? 'degraded' : 'unhealthy';

    return {
      status,
      database: databaseHealthy,
      redis: redisHealthy,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
  }

  async getUsers(page: number = 1, limit: number = 20): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { users, total };
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
