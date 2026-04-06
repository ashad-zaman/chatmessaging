import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from '@modules/admin/controllers/admin.controller';
import { AdminService } from '@modules/admin/services/admin.service';
import { User } from '@domain/entities/user.entity';
import { Message } from '@domain/entities/message.entity';
import { Conversation } from '@domain/entities/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message, Conversation])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
