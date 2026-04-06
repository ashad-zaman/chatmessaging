import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadAttachmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
