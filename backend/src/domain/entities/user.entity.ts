import { Entity, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { RefreshToken } from './refresh-token.entity';
import { BlockedUser } from './blocked-user.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'display_name', nullable: true })
  displayName: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'last_seen_at', nullable: true })
  lastSeenAt: Date;

  @Column({ name: 'is_online', default: false })
  isOnline: boolean;

  @Column({ nullable: true })
  @Exclude()
  passwordResetToken: string;

  @Column({ name: 'password_reset_expires', nullable: true })
  @Exclude()
  passwordResetExpires: Date;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => BlockedUser, (blocked) => blocked.blockedBy)
  blockedUsers: BlockedUser[];

  @OneToMany(() => BlockedUser, (blocked) => blocked.blockedUser)
  blockedBy: BlockedUser[];
}
