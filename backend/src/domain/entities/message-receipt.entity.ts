import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Message } from './message.entity';

export enum ReceiptType {
  DELIVERED = 'delivered',
  READ = 'read',
}

@Entity('message_receipts')
export class MessageReceipt extends BaseEntity {
  @ManyToOne(() => Message, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @Column({ name: 'message_id' })
  messageId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: ReceiptType,
    default: ReceiptType.DELIVERED,
  })
  type: ReceiptType;

  @Column({ name: 'read_at', nullable: true })
  readAt: Date;
}
