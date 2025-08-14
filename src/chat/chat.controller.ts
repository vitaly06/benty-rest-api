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
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Недопустимый тип файла. Разрешены: JPEG, PNG, PDF',
            ),
            false,
          );
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    // @Req() req: RequestWithUser,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }
    return { filePath: `/uploads/${file.filename}` };
  }
}
