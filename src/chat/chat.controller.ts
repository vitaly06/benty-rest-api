import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.dto';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('history')
  async getChatHistory(@Req() req: RequestWithUser) {
    return this.chatService.getChatHistory(req.user.sub);
  }

  @Get(':user2Id')
  async getChat(
    @Req() req: RequestWithUser,
    @Param('user2Id') user2Id: number,
  ) {
    return this.chatService.findOrCreateChat(req.user.sub, user2Id);
  }
}
