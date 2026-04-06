import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('conversation_participants')
export class ConversationParticipant extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'conversation_id' })
  conversationId: string;

  @Column({ name: 'last_read_message_id', nullable: true })
  lastReadMessageId: string;

  @Column({ name: 'unread_count', default: 0 })
  unreadCount: number;

  @Column({ name: 'is_muted', default: false })
  isMuted: boolean;
}
