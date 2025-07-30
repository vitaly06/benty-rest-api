import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpRequest } from './dto/sign-up.dto';
import { signInRequest } from './dto/sign-in.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Response } from 'express';
import {
  RequestWithUser,
  RequestWithUserRefresh,
} from './interfaces/request-with-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordRequest } from './dto/forgot-password.dto';
import { ChangePasswordRequest } from './dto/change-password.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: 'Регистрация',
  })
  @Post('sign-up')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: signUpRequest,
  ) {
    const result = await this.authService.signUp(dto);

    this.setCookies(res, result.tokens);
    return await this.userService.getAvatar(result.user.id);
  }

  @ApiOperation({
    summary: 'Авторизация',
  })
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: signInRequest,
  ) {
    const result = await this.authService.signIn(dto);
    this.setCookies(res, result.tokens);
    return await this.userService.getAvatar(result.checkUser.id);
  }

  @ApiOperation({
    summary: 'Выход',
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.user.sub);
    this.clearCookies(res);
    return { message: 'Выход успешно выполен' };
  }

  @ApiOperation({
    summary: 'Обновление токенов',
  })
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: RequestWithUserRefresh,
  ) {
    const tokens = await this.authService.refreshToken(
      req.user.sub,
      req.user.refreshToken,
    );

    this.setCookies(res, tokens);
    return { message: 'Токены успешно обновлены' };
  }

  @ApiOperation({
    summary: 'Проверка кода верификации',
  })
  @UseGuards(JwtAuthGuard)
  @Get('verify-email')
  async verifyEmail(@Query('code') code: string, @Req() req: RequestWithUser) {
    return await this.authService.verifyEmail(code, req);
  }

  @ApiTags('Забыл пароль')
  @ApiOperation({
    summary: 'Забыл пароль (отправка почты)',
  })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordRequest) {
    return await this.authService.forgotPassword(dto);
  }

  @ApiTags('Забыл пароль')
  @ApiOperation({
    summary: 'Проверка кода для смены пароля',
  })
  @Get('verify-password-code')
  async verifyPasswordCode(@Query('code') code: string) {
    return await this.authService.verifyPassword(code);
  }

  @ApiTags('Забыл пароль')
  @ApiOperation({
    summary: 'Смена пароля',
  })
  @Post('change-password')
  async changePassword(@Body() dto: ChangePasswordRequest) {
    await this.authService.changePassword(dto.userId, dto.password);
  }

  private setCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Изменили с 'lax' на 'strict' для безопасности
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
