import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Request, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Inject } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';
import { AttachmentsService, UploadedFile as UploadedFileType } from '@modules/attachments/services/attachments.service';
import { StorageService } from '@modules/attachments/services/storage.service';
import { UploadAttachmentDto } from '@modules/attachments/dto/upload-attachment.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Attachment } from '@domain/entities/attachment.entity';

@ApiTags('attachments')
@Controller('attachments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttachmentsController {
  constructor(
    @Inject(forwardRef(() => AttachmentsService))
    private readonly attachmentsService: AttachmentsService,
    private readonly storageService: StorageService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload an attachment' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully', type: Attachment })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  async uploadAttachment(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadAttachmentDto,
  ): Promise<Attachment> {
    const storedFile = await this.storageService.uploadFile({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      buffer: file.buffer,
    });

    return this.attachmentsService.uploadAttachment(
      req.user.userId,
      {
        filename: storedFile.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: storedFile.url,
      },
      uploadDto,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attachment by ID' })
  @ApiResponse({ status: 200, description: 'Attachment details', type: Attachment })
  async getAttachment(@Param('id') id: string): Promise<Attachment> {
    return this.attachmentsService.getAttachment(id);
  }
}
