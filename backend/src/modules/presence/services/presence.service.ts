import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '@infrastructure/redis/redis.module';
import { Logger } from '@common/logger/logger';

export interface UserPresence {
  userId: string;
  isOnline: boolean;
  lastSeenAt: Date | null;
  devices: string[];
}

@Injectable()
export class PresenceService {
  private readonly logger = new Logger('PresenceService');
  private readonly PRESENCE_TTL = 300;
  private readonly PRESENCE_KEY_PREFIX = 'presence:';

  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {}

  async setUserOnline(userId: string): Promise<void> {
    const key = `${this.PRESENCE_KEY_PREFIX}${userId}`;
    await this.redisClient.hset(key, {
      isOnline: 'true',
      lastSeenAt: new Date().toISOString(),
    });
    await this.redisClient.expire(key, this.PRESENCE_TTL);
    this.logger.log(`User online: ${userId}`);
  }

  async setUserOffline(userId: string): Promise<void> {
    const key = `${this.PRESENCE_KEY_PREFIX}${userId}`;
    await this.redisClient.hset(key, {
      isOnline: 'false',
      lastSeenAt: new Date().toISOString(),
    });
    await this.redisClient.expire(key, this.PRESENCE_TTL);
    this.logger.log(`User offline: ${userId}`);
  }

  async getUserPresence(userId: string): Promise<UserPresence | null> {
    const key = `${this.PRESENCE_KEY_PREFIX}${userId}`;
    const data = await this.redisClient.hgetall(key);

    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      userId,
      isOnline: data.isOnline === 'true',
      lastSeenAt: data.lastSeenAt ? new Date(data.lastSeenAt) : null,
      devices: data.devices ? JSON.parse(data.devices) : [],
    };
  }

  async isUserOnline(userId: string): Promise<boolean> {
    const presence = await this.getUserPresence(userId);
    return presence?.isOnline || false;
  }

  async getOnlineUsers(): Promise<string[]> {
    const keys = await this.redisClient.keys(`${this.PRESENCE_KEY_PREFIX}*`);
    const onlineUsers: string[] = [];

    for (const key of keys) {
      const data = await this.redisClient.hget(key, 'isOnline');
      if (data === 'true') {
        const userId = key.replace(this.PRESENCE_KEY_PREFIX, '');
        onlineUsers.push(userId);
      }
    }

    return onlineUsers;
  }

  async addDevice(userId: string, deviceId: string): Promise<void> {
    const key = `${this.PRESENCE_KEY_PREFIX}${userId}`;
    const devicesJson = await this.redisClient.hget(key, 'devices');
    const devices: string[] = devicesJson ? JSON.parse(devicesJson) : [];
    
    if (!devices.includes(deviceId)) {
      devices.push(deviceId);
      await this.redisClient.hset(key, 'devices', JSON.stringify(devices));
    }
  }

  async removeDevice(userId: string, deviceId: string): Promise<void> {
    const key = `${this.PRESENCE_KEY_PREFIX}${userId}`;
    const devicesJson = await this.redisClient.hget(key, 'devices');
    const devices: string[] = devicesJson ? JSON.parse(devicesJson) : [];
    
    const index = devices.indexOf(deviceId);
    if (index > -1) {
      devices.splice(index, 1);
      await this.redisClient.hset(key, 'devices', JSON.stringify(devices));
    }
  }

  async subscribeToPresence(userId: string, callback: (presence: UserPresence) => void): Promise<void> {
    const subscriber = this.redisClient.duplicate();
    await subscriber.subscribe(`presence:${userId}`);
    
    subscriber.on('message', (channel, message) => {
      const presence = JSON.parse(message);
      callback(presence);
    });
  }

  async broadcastPresenceUpdate(userId: string, isOnline: boolean): Promise<void> {
    const presence: UserPresence = {
      userId,
      isOnline,
      lastSeenAt: isOnline ? null : new Date(),
      devices: [],
    };

    await this.redisClient.publish('chat_events', JSON.stringify({
      type: 'presence_update',
      data: presence,
    }));
  }
}
