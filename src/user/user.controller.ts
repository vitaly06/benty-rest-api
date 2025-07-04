import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiParam, ApiProduces } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

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
    const file = createReadStream(
      join(process.cwd(), 'uploads', 'avatars', filename),
    );
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `inline; filename="${filename}"`,
    });

    return new StreamableFile(file);
  }
}
