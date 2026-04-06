import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('user_blocks')
export class BlockedUser extends BaseEntity {
  @ManyToOne(() => User, (user) => user.blockedUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blocked_by_id' })
  blockedBy: User;

  @Column({ name: 'blocked_by_id' })
  blockedById: string;

  @ManyToOne(() => User, (user) => user.blockedBy, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blocked_user_id' })
  blockedUser: User;

  @Column({ name: 'blocked_user_id' })
  blockedUserId: string;
}
