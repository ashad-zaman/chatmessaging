import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '@domain/entities/message.entity';

export class SendMessageDto {
  @ApiProperty()
  @IsString()
  conversationId: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ enum: MessageType, required: false })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  replyToId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  attachmentId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  clientMessageId?: string;
}
