import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractAccessToken(request);

    try {
      // Пробуем верифицировать access token
      await this.jwtService.verifyAsync(accessToken);
      return super.canActivate(context) as Promise<boolean>;
    } catch (accessError) {
      console.log(accessError);
      // Если access token невалиден, проверяем refresh token
      const refreshToken = this.extractRefreshToken(request);

      if (!refreshToken) {
        throw new UnauthorizedException('Необходима авторизация');
      }

      try {
        // Верифицируем refresh token
        const payload = await this.jwtService.verifyAsync(refreshToken);

        // Проверяем, что refresh token есть в базе
        const user = await this.prisma.user.findUnique({
          where: { id: payload.sub, refreshToken },
        });

        if (!user) {
          throw new UnauthorizedException('Недействительный refresh token');
        }

        // Генерируем новые токены
        const newTokens = await this.generateTokens(payload.sub);

        // Обновляем refresh token в базе
        await this.prisma.user.update({
          where: { id: payload.sub },
          data: { refreshToken: newTokens.refreshToken },
        });

        // Устанавливаем новые токены в cookies
        this.setTokensToResponse(context, newTokens);

        // Добавляем новые токены в запрос
        request.cookies['access_token'] = newTokens.accessToken;
        request.cookies['refresh_token'] = newTokens.refreshToken;

        return super.canActivate(context) as Promise<boolean>;
      } catch (refreshError) {
        console.log(refreshError);
        throw new UnauthorizedException(
          'Сессия истекла, необходимо войти снова',
        );
      }
    }
  }

  private extractAccessToken(request: Request): string {
    return (
      request.cookies?.['access_token'] ||
      request.headers['authorization']?.split(' ')[1]
    );
  }

  private extractRefreshToken(request: Request): string {
    return request.cookies?.['refresh_token'];
  }

  private async generateTokens(userId: number): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = { sub: userId };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  private setTokensToResponse(
    context: ExecutionContext,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const response = context.switchToHttp().getResponse();
    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 минут
    });
    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });
  }
}
