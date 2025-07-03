import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpRequest } from './dto/sign-up.dto';
import { signInRequest } from './dto/sign-in.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Response } from 'express';
import {
  RequestWithUser,
  RequestWithUserRefresh,
} from './interfaces/request-with-user.dto';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: signUpRequest,
  ) {
    const tokens = await this.authService.signUp(dto);
    this.setCookies(res, tokens);
    return { message: 'Регистрация прошла успешно' };
  }

  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: signInRequest,
  ) {
    const tokens = await this.authService.signIn(dto);
    this.setCookies(res, tokens);
    return { message: 'Успешный вход' };
  }

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

  @UseGuards(JwtRefreshGuard)
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

  private clearCookies(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
