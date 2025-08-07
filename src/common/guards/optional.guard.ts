import { Injectable, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt.guard';

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
  ) {
    super(jwtService, prisma, configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request & {
      user?: any;
    };

    try {
      // Пытаемся аутентифицировать, но не падаем при ошибке
      await super.canActivate(context);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      request.user = undefined;
    }

    return true; // Всегда разрешаем запрос
  }
}
