import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiParam, ApiProduces } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { updateMainSettingsRequest } from './dto/update-main-settings.dto';

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
    await this.userService.updateMainSettings(dto, req);
  }
}
