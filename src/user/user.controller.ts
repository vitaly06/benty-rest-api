import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProduces,
} from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { updateMainSettingsRequest } from './dto/update-main-settings.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import mime from 'mime';
import { UpdateNotificationsSettingsRequest } from './dto/update-notifications-settings.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('best-specialists')
  async getBestSpecialists() {
    return await this.userService.getBestSpecialists();
  }
  @ApiOperation({
    summary: 'Получение фото пользователя',
  })
  @ApiParam({ name: 'filename', description: 'Имя файла', type: String })
  @ApiProduces('image/*')
  @Get('photo/:filename')
  async getPhoto(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    let filePath: string;

    // Сначала проверяем аватары
    const avatarPath = join(process.cwd(), 'uploads', 'avatars', filename);
    const coverPath = join(process.cwd(), 'uploads', 'covers', filename);

    if (existsSync(avatarPath)) {
      filePath = avatarPath;
    } else if (existsSync(coverPath)) {
      filePath = coverPath;
    } else {
      throw new NotFoundException('Файл не найден');
    }

    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    // Создаем поток для чтения файла
    const fileStream = createReadStream(filePath);

    // Устанавливаем заголовки ответа
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'public, max-age=31536000',
    });

    return new StreamableFile(fileStream);
  }

  @ApiOperation({
    summary: 'Получение основных настроект пользователя',
  })
  @UseGuards(JwtAuthGuard)
  @Get('get-main-settings')
  async getMainSettings(@Req() req: RequestWithUser) {
    return await this.userService.getMainSettings(req);
  }

  @ApiOperation({
    summary: 'Обновление основных настроект',
  })
  @UseGuards(JwtAuthGuard)
  @Put('update-main-settings')
  async updateMainSettings(
    @Body() dto: updateMainSettingsRequest,
    @Req() req: RequestWithUser,
  ) {
    return await this.userService.updateMainSettings(dto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-decor-settings')
  async getDecorSettings(@Req() req: RequestWithUser) {
    return await this.userService.getDecorSettings(req);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Обновление аватарки',
  })
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @Put('update-avatar')
  @UseInterceptors(FileInterceptor('photo'))
  async updateAvatar(
    @UploadedFile() photo: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    return await this.userService.updateAvatar(photo.filename, req);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Обновление обложки',
  })
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @Put('update-cover')
  @UseInterceptors(FileInterceptor('photo'))
  async updateCover(
    @UploadedFile() photo: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    return await this.userService.updateCover(photo.filename, req);
  }

  @ApiOperation({
    summary: 'Удаление аватарки',
  })
  @Delete('delete-avatar')
  async deleteAvatar(@Req() req: RequestWithUser) {
    return await this.userService.deleteAvatar(req);
  }

  @ApiOperation({
    summary: 'Удаление обложки',
  })
  @Delete('delete-cover')
  async deleteCover(@Req() req: RequestWithUser) {
    return await this.userService.deleteCover(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-notifications-settings')
  async getNotificationsSettings(@Req() req: RequestWithUser) {
    return await this.userService.getNotificationsSettings(req);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-notifications-settings')
  async updateNotificationsSettings(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateNotificationsSettingsRequest,
  ) {
    return await this.userService.updateNotificationsSettings(req, dto);
  }
}
