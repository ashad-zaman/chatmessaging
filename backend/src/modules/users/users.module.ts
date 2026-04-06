import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '@modules/users/controllers/users.controller';
import { UsersService } from '@modules/users/services/users.service';
import { User } from '@domain/entities/user.entity';
import { BlockedUser } from '@domain/entities/blocked-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, BlockedUser])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
