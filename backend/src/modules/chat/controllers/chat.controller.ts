import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from '@modules/chat/services/chat.service';
import { SendMessageDto } from '@modules/chat/dto/send-message.dto';
import { GetMessagesDto } from '@modules/chat/dto/get-messages.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Message } from '@domain/entities/message.entity';

@ApiTags('messages')
@Controller('conversations/:conversationId/messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({ status: 201, description: 'Message sent', type: Message })
  async sendMessage(
    @Request() req: any,
    @Param('conversationId') conversationId: string,
    @Body() sendDto: SendMessageDto,
  ): Promise<Message> {
    return this.chatService.sendMessage(req.user.userId, {
      ...sendDto,
      conversationId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get messages in a conversation' })
  @ApiResponse({ status: 200, description: 'List of messages' })
  async getMessages(
    @Request() req: any,
    @Param('conversationId') conversationId: string,
    @Query() getMessagesDto: GetMessagesDto,
  ) {
    return this.chatService.getMessages(conversationId, req.user.userId, getMessagesDto);
  }

  @Get(':messageId')
  @ApiOperation({ summary: 'Get a specific message' })
  @ApiResponse({ status: 200, description: 'Message details', type: Message })
  async getMessage(
    @Request() req: any,
    @Param('conversationId') conversationId: string,
    @Param('messageId') messageId: string,
  ): Promise<Message> {
    return this.chatService.getMessageById(messageId);
  }

  @Post(':messageId/read')
  @ApiOperation({ summary: 'Mark message as read' })
  @ApiResponse({ status: 200, description: 'Message marked as read' })
  async markAsRead(
    @Request() req: any,
    @Param('conversationId') conversationId: string,
    @Param('messageId') messageId: string,
  ): Promise<void> {
    return this.chatService.markMessageAsRead(messageId, req.user.userId);
  }
}
