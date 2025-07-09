import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { updateMainSettingsRequest } from './dto/update-main-settings.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import { UpdateNotificationsSettingsRequest } from './dto/update-notifications-settings.dto';
import { ChangeLoginRequest } from './dto/change-login.dto';
import { Response } from 'express';
import { ChangeEmailRequest } from './dto/change-email.dto';
import { ChangePhoneRequest } from './dto/change-phone.dto';
import { ChangePasswordRequest } from './dto/change-password';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Получение лучших специалистов',
  })
  @Get('best-specialists')
  async getBestSpecialists() {
    return await this.userService.getBestSpecialists();
  }

  @ApiOperation({
    summary: 'Получение основных настроект пользователя',
  })
  @ApiTags('Главные настройки')
  @UseGuards(JwtAuthGuard)
  @Get('get-main-settings')
  async getMainSettings(@Req() req: RequestWithUser) {
    return await this.userService.getMainSettings(req);
  }

  @ApiOperation({
    summary: 'Обновление основных настроект',
  })
  @ApiTags('Главные настройки')
  @UseGuards(JwtAuthGuard)
  @Put('update-main-settings')
  async updateMainSettings(
    @Body() dto: updateMainSettingsRequest,
    @Req() req: RequestWithUser,
  ) {
    return await this.userService.updateMainSettings(dto, req);
  }

  @ApiOperation({
    summary: 'Получение настроект оформления',
  })
  @ApiTags('Настройки оформления')
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
  @ApiTags('Настройки оформления')
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
  @ApiTags('Настройки оформления')
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
  @ApiTags('Настройки оформления')
  @Delete('delete-avatar')
  async deleteAvatar(@Req() req: RequestWithUser) {
    return await this.userService.deleteAvatar(req);
  }

  @ApiOperation({
    summary: 'Удаление обложки',
  })
  @ApiTags('Настройки оформления')
  @Delete('delete-cover')
  async deleteCover(@Req() req: RequestWithUser) {
    return await this.userService.deleteCover(req);
  }

  @ApiOperation({
    summary: 'Получение настроект уведомлений',
  })
  @ApiTags('Настройки уведомлений')
  @UseGuards(JwtAuthGuard)
  @Get('get-notifications-settings')
  async getNotificationsSettings(@Req() req: RequestWithUser) {
    return await this.userService.getNotificationsSettings(req);
  }

  @ApiOperation({
    summary: 'Обновление настроект оформления',
  })
  @ApiTags('Настройки уведомлений')
  @UseGuards(JwtAuthGuard)
  @Put('update-notifications-settings')
  async updateNotificationsSettings(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateNotificationsSettingsRequest,
  ) {
    return await this.userService.updateNotificationsSettings(req, dto);
  }

  @ApiOperation({
    summary: 'Смена логниа',
  })
  @UseGuards(JwtAuthGuard)
  @ApiTags('Смена логина')
  @Post('change-login')
  async changeLogin(
    @Body() dto: ChangeLoginRequest,
    @Req() req: RequestWithUser,
  ) {
    await this.userService.changeLogin(dto, req);
  }

  @ApiOperation({
    summary: 'Проверка кода для смены логина',
  })
  @UseGuards(JwtAuthGuard)
  @ApiTags('Смена логина')
  @Get('verify-login-code')
  async verifyLoginCode(
    @Query('code') code: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const tokens = await this.userService.verifyLoginCode(code, req);
    this.setCookies(res, tokens);
  }

  @ApiTags('Смена почты')
  @ApiOperation({
    summary: 'Смена почты',
  })
  @UseGuards(JwtAuthGuard)
  @Post('change-email')
  async changeEmail(
    @Body() dto: ChangeEmailRequest,
    @Req() req: RequestWithUser,
  ) {
    return await this.userService.changeEmail(dto, req);
  }

  @ApiTags('Смена почты')
  @ApiOperation({
    summary: 'Проверка кода со старой почты',
  })
  @UseGuards(JwtAuthGuard)
  @Post('verify-old-email-code')
  async verifyOldEmailCode(
    @Query('code') code: string,
    @Req() req: RequestWithUser,
  ) {
    await this.userService.verifyOldEmailCode(code, req);
  }

  @ApiTags('Смена почты')
  @ApiOperation({
    summary: 'Верификация новой почты',
  })
  @UseGuards(JwtAuthGuard)
  @Post('verify-new-email-code')
  async verifyNewEmailCode(
    @Query('code') code: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.userService.verifyNewEmailCode(code, req);
  }

  @ApiTags('Смена номера телефона')
  @ApiOperation({
    summary: 'Смена телефона',
  })
  @UseGuards(JwtAuthGuard)
  @Post('change-phone')
  async changePhone(
    @Body() dto: ChangePhoneRequest,
    @Req() req: RequestWithUser,
  ) {
    return await this.userService.changePhone(dto, req);
  }

  @ApiTags('Смена номера телефона')
  @ApiOperation({
    summary: 'Проверка кода для смены номера телефона',
  })
  @Post('verify-phone-email-code')
  @UseGuards(JwtAuthGuard)
  async verifyPhoneEmailCode(
    @Query('code') code: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.userService.verifyPhoneEmailCode(code, req);
  }

  @ApiTags('Смена пароля в настройках')
  @ApiOperation({
    summary: 'Смена пароля в настройках',
  })
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() dto: ChangePasswordRequest,
    @Req() req: RequestWithUser,
  ) {
    return await this.userService.changePassword(dto, req);
  }

  @ApiTags('Смена пароля в настройках')
  @ApiOperation({
    summary: 'Проверка кода для смены пароля',
  })
  @UseGuards(JwtAuthGuard)
  @Post('verify-change-password-code')
  async verifyChangePasswordCode(
    @Query('code') code: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.userService.verifyChangePasswordCode(code, req);
  }
  private setCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 минут
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });
  }
}
