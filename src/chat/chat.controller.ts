// src/chat/chat.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Req,
  Query,
  Post,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Получить историю переписки с пользователем' })
  @ApiQuery({
    name: 'otherUserId',
    type: Number,
    description: 'ID второго пользователя',
  })
  @UseGuards(JwtAuthGuard)
  @Get('conversation')
  async getConversation(
    @Req() req: RequestWithUser,
    @Query('otherUserId') otherUserId: string,
  ) {
    return await this.chatService.getConversation(req.user.sub, +otherUserId);
  }

  @ApiOperation({ summary: 'Получить все чаты текущего пользователя' })
  @UseGuards(JwtAuthGuard)
  @Get('chats')
  async getUserChats(@Req() req: RequestWithUser) {
    return await this.chatService.getUserChats(req.user.sub);
  }

  @Post('upload-file')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    // @Req() req: RequestWithUser,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }
    return { filePath: `${file.filename}` };
  }
}
