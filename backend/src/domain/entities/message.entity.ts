import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { MessageReceipt } from './message-receipt.entity';

export enum MessageStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video',
}

@Entity('messages')
export class Message extends BaseEntity {
  @Column({ name: 'conversation_id' })
  conversationId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ name: 'sender_id' })
  senderId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  type: MessageType;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.PENDING,
  })
  status: MessageStatus;

  @Column({ name: 'reply_to_id', nullable: true })
  replyToId: string;

  @Column({ name: 'attachment_id', nullable: true })
  attachmentId: string;

  @Column({ name: 'client_message_id', nullable: true })
  clientMessageId: string;

  @OneToMany(() => MessageReceipt, (receipt) => receipt.message)
  receipts: MessageReceipt[];
}
