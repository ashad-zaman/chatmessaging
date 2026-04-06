import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConversationsService } from '@modules/conversations/services/conversations.service';
import { CreateConversationDto } from '@modules/conversations/dto/create-conversation.dto';
import { GetConversationsDto } from '@modules/conversations/dto/get-conversations.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Conversation } from '@domain/entities/conversation.entity';

@ApiTags('conversations')
@Controller('conversations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({ status: 201, description: 'Conversation created', type: Conversation })
  async create(@Body() createDto: CreateConversationDto): Promise<Conversation> {
    return this.conversationsService.createConversation(createDto);
  }

  @Post('direct/:userId')
  @ApiOperation({ summary: 'Create or get direct conversation with user' })
  @ApiResponse({ status: 201, description: 'Conversation created or returned', type: Conversation })
  async createDirect(
    @Request() req: any,
    @Param('userId') userId: string,
  ): Promise<Conversation> {
    return this.conversationsService.createDirectConversation(req.user.userId, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get user conversations' })
  @ApiResponse({ status: 200, description: 'List of conversations' })
  async getConversations(
    @Request() req: any,
    @Query() getConversationsDto: GetConversationsDto,
  ) {
    return this.conversationsService.getUserConversations(req.user.userId, getConversationsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get conversation by ID' })
  @ApiResponse({ status: 200, description: 'Conversation details' })
  async getConversation(
    @Request() req: any,
    @Param('id') id: string,
  ) {
    return this.conversationsService.getConversationById(id, req.user.userId);
  }
}
