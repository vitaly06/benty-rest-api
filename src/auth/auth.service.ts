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
import { JwtPayload } from './interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { ForgotPasswordRequest } from './dto/forgot-password.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RequestWithUser } from './interfaces/request-with-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signUp(dto: signUpRequest) {
    const { profileTypeId, login, email, password, repassword } = { ...dto };

    const checkProfileType = await this.prisma.profileType.findUnique({
      where: { id: profileTypeId },
    });
    if (!checkProfileType) {
      throw new BadRequestException('Типа профиля с таким id не существует');
    }

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

    const user = await this.prisma.user.create({
      data: {
        login,
        email,
        password: hashedPassword,
        profileTypeId,
        isEmailVerified: false,
      },
    });
    await this.cacheManager.set(`verify-email:${user.id}`, code, 0);

    await this.sendVerificationEmail(
      user.email,
      'Подтверждение email',
      code,
      './email-verification',
    );

    const tokens = await this.getTokens(user.id, user.login);
    this.updateRefreshToken(user.id, tokens.refreshToken);

    return { tokens, user };
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

  async verifyEmail(code: string, req: RequestWithUser) {
    const cachedData = await this.cacheManager.get<string>(
      `verify-email:${req.user.sub}`,
    );

    if (!cachedData) {
      console.log('Данные не найдены в кеше');
    }
    if (cachedData !== code) {
      throw new BadRequestException('Неверный код подтверждения');
    }

    await this.prisma.user.update({
      where: { id: req.user.sub },
      data: {
        isEmailVerified: true,
      },
    });

    await this.cacheManager.del(`verify-email:${req.user.sub}`);

    return { message: 'Почта успешно подтверждена' };
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
      0,
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
    if (!user) {
      throw new ForbiddenException('Доступ запрещён');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Доступ запрещён');
    }

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new BadRequestException('Такого пользователя не существует');
    }

    const hashedToken = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: hashedToken,
      },
    });
  }

  async getTokens(id: number, login: string) {
    const payload: JwtPayload = { sub: id, login };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async generateVerifyCode(): Promise<string> {
    const uuid = uuidv4();
    const numericValue = parseInt(uuid.replace(/[^0-9]/g, ''), 10);
    const code = String(numericValue).substring(0, 6);
    return code;
  }
}
