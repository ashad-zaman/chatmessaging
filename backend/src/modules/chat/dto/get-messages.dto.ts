import { IsOptional, IsInt, Min, Max, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetMessagesDto {
  @ApiProperty({ required: false, default: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 50;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  before?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  after?: string;
}
