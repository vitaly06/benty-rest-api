import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.url.startsWith('/webhooks/')) {
      return true; // Пропускаем без аутентификации
    }

    try {
      return super.canActivate(context) as Promise<boolean>;
    } catch (error) {
      throw new UnauthorizedException('Требуется авторизация');
    }
  }
}
