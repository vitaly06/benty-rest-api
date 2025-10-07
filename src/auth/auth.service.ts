import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { signUpRequest } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { signInRequest } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgotPasswordRequest } from './dto/forgot-password.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signUp(dto: signUpRequest) {
    const { login, email, password, repassword, promocode } = { ...dto };

    const checkUser =
      (await this.userService.findByEmail(email)) ||
      (await this.userService.findByLogin(login));
    if (checkUser) {
      throw new BadRequestException('Данный пользователь уже зарегистрирован');
    }

    if (password != repassword) {
      throw new BadRequestException('Пароли не совпадают');
    }
    const code = await this.generateVerifyCode();

    const hashedPassword = await bcrypt.hash(password, 10);

    // Проверка промокода и выбор подписки
    let subscription;
    let subscriptionStartAt = null;
    let subscriptionEndAt = null;

    if (promocode && promocode.toUpperCase() === 'BENTY90') {
      subscription = await this.prisma.subscription.findUnique({
        where: { name: 'premium' },
      });
      if (!subscription) {
        throw new BadRequestException('Premium подписка не найдена');
      }
      subscriptionStartAt = new Date();
      subscriptionEndAt = new Date();
      subscriptionEndAt.setDate(subscriptionEndAt.getDate() + 90);
    } else {
      // Обычная подписка по умолчанию
      subscription = await this.prisma.subscription.findUnique({
        where: { name: 'default' },
      });
      if (!subscription) {
        throw new BadRequestException('Подписка по умолчанию не найдена');
      }
    }

    console.log(code);
    const cachedData = {
      login,
      email,
      password: hashedPassword,
      isEmailVerified: true,
      subscriptionId: subscription.id,
      subscriptionStartAt,
      subscriptionEndAt,
    };

    await this.cacheManager.set(
      `verify-email:${code}`,
      JSON.stringify(cachedData),
      3600,
    );

    await this.sendVerificationEmail(
      email,
      'Подтверждение email',
      code,
      './email-verification',
    );

    // const tokens = await this.getTokens(user.id, user.login);
    // this.updateRefreshToken(user.id, tokens.refreshToken);

    // return { tokens, user };
    return { message: 'Код отправлен на почту' };
  }

  private async sendVerificationEmail(
    email: string,
    text: string,
    code: string,
    template: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: text,
        template,
        context: {
          code,
        },
      });
    } catch (error) {
      console.error('Ошибка отправки письма:', error);
      throw new BadRequestException('Ошибка отправки письма подтверждения');
    }
  }

  async verifyEmail(code: string) {
    const cachedData = await this.cacheManager.get<string>(
      `verify-email:${code}`,
    );

    if (!cachedData) {
      console.log('Неверный код');
    }

    const registrationData = JSON.parse(cachedData);

    const user = await this.prisma.user.create({
      data: {
        ...registrationData,
      },
    });

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    await this.cacheManager.del(`verify-email:${code}`);

    return { tokens, user };
  }

  async signIn(dto: signInRequest) {
    const { email, password } = { ...dto };

    const checkUser = await this.userService.findByEmail(email);
    if (!checkUser) {
      throw new UnauthorizedException('Такого пользователя не существует');
    }
    if (!(await bcrypt.compare(password, checkUser.password))) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const tokens = await this.getTokens(checkUser.id, checkUser.login);
    await this.updateRefreshToken(checkUser.id, tokens.refreshToken);
    return { tokens, checkUser };
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: { id: userId },
      data: {
        refreshToken: null,
      },
    });
  }

  async forgotPassword(dto: ForgotPasswordRequest) {
    const { email } = { ...dto };
    const checkUser = await this.userService.findByEmail(email);
    if (!checkUser) {
      throw new NotFoundException('Данного пользователя не существует');
    }
    const code = await this.generateVerifyCode();
    await this.cacheManager.set(
      `forgot-password:${code}`,
      JSON.stringify({
        id: checkUser.id.toString(),
        code,
      }),
      3600,
    );

    await this.sendVerificationEmail(
      email,
      'Восстановление пароля',
      code,
      './change-password',
    );
  }

  async verifyPassword(code: string) {
    const cachedDataStr = await this.cacheManager.get<string>(
      `forgot-password:${code}`,
    );
    const cachedData = cachedDataStr ? JSON.parse(cachedDataStr) : null;

    if (!cachedData) {
      console.log('Данные не найдены в кеше');
    }
    if (cachedData.code !== code) {
      throw new BadRequestException('Неверный код подтверждения');
    }
    const user = await this.userService.findById(+cachedData.id);

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isResetVerified: true,
      },
    });

    await this.cacheManager.del(`forgot-password:${code}`);
    return user.id;
  }

  async changePassword(userId: number, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (!user.isResetVerified) {
      throw new ForbiddenException('Требуется подтверждение сброса пароля');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: await bcrypt.hash(password, 10),
        isResetVerified: false,
      },
    });

    return { success_true: true };
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Доступ запрещён');
    }

    // Проверяем соответствие токена без хэширования
    if (refreshToken !== user.refreshToken) {
      throw new ForbiddenException('Доступ запрещён');
    }

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken, // Сохраняем без хэширования
      },
    });
  }

  async getTokens(userId: number, login: string) {
    const payload = { sub: userId, login };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
          '15m',
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '7d',
        ),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async generateVerifyCode(): Promise<string> {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Генерирует 6 цифр (от 100000 до 999999)
  }
}
