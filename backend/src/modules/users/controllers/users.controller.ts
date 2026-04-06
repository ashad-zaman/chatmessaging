import { Controller, Get, Patch, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '@modules/users/services/users.service';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';
import { SearchUsersDto } from '@modules/users/dto/search-users.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { User } from '@domain/entities/user.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile', type: User })
  async getCurrentUser(@Request() req: any): Promise<User> {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  @ApiResponse({ status: 409, description: 'Username already taken' })
  async updateCurrentUser(
    @Request() req: any,
    @Body() updateDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(req.user.userId, updateDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users by username, email or display name' })
  @ApiResponse({ status: 200, description: 'List of users', type: [User] })
  async searchUsers(
    @Request() req: any,
    @Query() searchDto: SearchUsersDto,
  ): Promise<User[]> {
    return this.usersService.searchUsers(searchDto, req.user.userId);
  }
}
