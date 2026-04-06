import { Entity, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ConversationParticipant } from './conversation-participant.entity';
import { User } from './user.entity';

export enum ConversationType {
  DIRECT = 'direct',
  GROUP = 'group',
}

@Entity('conversations')
export class Conversation extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ConversationType,
    default: ConversationType.DIRECT,
  })
  type: ConversationType;

  @Column({ nullable: true })
  name: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ name: 'last_message_id', nullable: true })
  lastMessageId: string;

  @Column({ name: 'last_message_at', nullable: true })
  lastMessageAt: Date;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @OneToMany(
    () => ConversationParticipant,
    (participant) => participant.conversationId,
    { cascade: true },
  )
  participants: ConversationParticipant[];
}
