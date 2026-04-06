import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { User } from '@domain/entities/user.entity';
import { BlockedUser } from '@domain/entities/blocked-user.entity';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';
import { SearchUsersDto } from '@modules/users/dto/search-users.dto';
import { Logger } from '@common/logger/logger';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BlockedUser)
    private readonly blockedUserRepository: Repository<BlockedUser>,
  ) {}

  async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async searchUsers(searchDto: SearchUsersDto, currentUserId: string): Promise<User[]> {
    const { query, limit = 20 } = searchDto;
    
    const blockedUserIds = await this.blockedUserRepository
      .createQueryBuilder('blocked')
      .select('blocked.blockedUserId')
      .where('blocked.blockedById = :userId', { userId: currentUserId })
      .getRawMany();

    const blockedIds = blockedUserIds.map((b) => b.blocked_user_id);

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id != :currentUserId', { currentUserId })
      .andWhere('user.id NOT IN (:...blockedIds)', { blockedIds: blockedIds.length ? blockedIds : [''] })
      .andWhere(
        '(user.username ILIKE :query OR user.email ILIKE :query OR user.display_name ILIKE :query)',
        { query: `%${query}%` }
      )
      .take(limit)
      .orderBy('user.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  async updateUser(userId: string, updateDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(userId);

    if (updateDto.username && updateDto.username !== user.username) {
      const existingUser = await this.findByUsername(updateDto.username);
      if (existingUser) {
        throw new ConflictException('Username already taken');
      }
      user.username = updateDto.username;
    }

    if (updateDto.displayName) {
      user.displayName = updateDto.displayName;
    }

    if (updateDto.avatarUrl) {
      user.avatarUrl = updateDto.avatarUrl;
    }

    await this.userRepository.save(user);
    this.logger.log(`User updated: ${userId}`);
    return user;
  }

  async blockUser(blockedById: string, blockedUserId: string): Promise<void> {
    if (blockedById === blockedUserId) {
      throw new ConflictException('Cannot block yourself');
    }

    const existing = await this.blockedUserRepository.findOne({
      where: { blockedById, blockedUserId },
    });

    if (existing) {
      throw new ConflictException('User already blocked');
    }

    const blockedUser = await this.blockedUserRepository.create({
      blockedById,
      blockedUserId,
    });

    await this.blockedUserRepository.save(blockedUser);
    this.logger.log(`User ${blockedUserId} blocked by ${blockedById}`);
  }

  async unblockUser(blockedById: string, blockedUserId: string): Promise<void> {
    const result = await this.blockedUserRepository.delete({
      blockedById,
      blockedUserId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Block record not found');
    }
    this.logger.log(`User ${blockedUserId} unblocked by ${blockedById}`);
  }

  async getBlockedUsers(userId: string): Promise<User[]> {
    const blockedRecords = await this.blockedUserRepository.find({
      where: { blockedById: userId },
      relations: ['blockedUser'],
    });

    return blockedRecords.map((record) => record.blockedUser);
  }

  async updateOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    await this.userRepository.update(userId, {
      isOnline,
      lastSeenAt: isOnline ? undefined : new Date(),
    });
  }

  async updateLastSeen(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      lastSeenAt: new Date(),
    });
  }
}
