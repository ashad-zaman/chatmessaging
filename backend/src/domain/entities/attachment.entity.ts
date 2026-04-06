import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum AttachmentType {
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video',
}

@Entity('attachments')
export class Attachment extends BaseEntity {
  @Column()
  filename: string;

  @Column({ name: 'original_name' })
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: AttachmentType,
    default: AttachmentType.FILE,
  })
  type: AttachmentType;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy: User;

  @Column({ name: 'uploaded_by_id', nullable: true })
  uploadedById: string;
}
