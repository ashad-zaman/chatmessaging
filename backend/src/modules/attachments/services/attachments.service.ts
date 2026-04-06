import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment, AttachmentType } from '@domain/entities/attachment.entity';
import { StorageService } from '@modules/attachments/services/storage.service';
import { UploadAttachmentDto } from '@modules/attachments/dto/upload-attachment.dto';
import { Logger } from '@common/logger/logger';

export interface UploadedFile {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

@Injectable()
export class AttachmentsService {
  private readonly logger = new Logger('AttachmentsService');
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024;
  private readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'video/mp4',
    'video/webm',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ];

  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    private readonly storageService: StorageService,
  ) {}

  async uploadAttachment(
    userId: string,
    file: UploadedFile,
    uploadDto: UploadAttachmentDto,
  ): Promise<Attachment> {
    this.validateFile(file);

    const attachmentType = this.getAttachmentType(file.mimeType);

    const attachment = this.attachmentRepository.create({
      filename: file.filename,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      url: file.url,
      type: attachmentType,
      uploadedById: userId,
    });

    const savedAttachment = await this.attachmentRepository.save(attachment);
    this.logger.log(`Attachment uploaded: ${savedAttachment.id} by ${userId}`);

    return savedAttachment;
  }

  async getAttachment(attachmentId: string): Promise<Attachment> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id: attachmentId },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    return attachment;
  }

  async deleteAttachment(attachmentId: string, userId: string): Promise<void> {
    const attachment = await this.getAttachment(attachmentId);

    if (attachment.uploadedById !== userId) {
      throw new BadRequestException('You can only delete your own attachments');
    }

    await this.storageService.deleteFile(attachment.filename);
    await this.attachmentRepository.delete(attachmentId);
    this.logger.log(`Attachment deleted: ${attachmentId}`);
  }

  private validateFile(file: UploadedFile): void {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(`File size exceeds maximum allowed size of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    if (!this.ALLOWED_MIME_TYPES.includes(file.mimeType)) {
      throw new BadRequestException('File type not allowed');
    }
  }

  private getAttachmentType(mimeType: string): AttachmentType {
    if (mimeType.startsWith('image/')) {
      return AttachmentType.IMAGE;
    }
    if (mimeType.startsWith('audio/')) {
      return AttachmentType.AUDIO;
    }
    if (mimeType.startsWith('video/')) {
      return AttachmentType.VIDEO;
    }
    return AttachmentType.FILE;
  }
}
