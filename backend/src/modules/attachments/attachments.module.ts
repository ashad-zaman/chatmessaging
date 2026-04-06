import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { AttachmentsController } from '@modules/attachments/controllers/attachments.controller';
import { AttachmentsService } from '@modules/attachments/services/attachments.service';
import { StorageService } from '@modules/attachments/services/storage.service';
import { Attachment } from '@domain/entities/attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment]),
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  ],
  controllers: [AttachmentsController],
  providers: [AttachmentsService, StorageService],
  exports: [AttachmentsService, StorageService],
})
export class AttachmentsModule {}
