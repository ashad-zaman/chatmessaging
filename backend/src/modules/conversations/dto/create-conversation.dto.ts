import { IsEnum, IsString, IsOptional, IsArray, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConversationType } from '@domain/entities/conversation.entity';

export class CreateConversationDto {
  @ApiProperty({ enum: ConversationType })
  @IsEnum(ConversationType)
  type: ConversationType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty()
  @IsString()
  createdById: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  participantIds: string[];
}
