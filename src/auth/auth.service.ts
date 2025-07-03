import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { signUpRequest } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { signInRequest } from './dto/sign-in.dto';
import { JwtPayload } from './interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        login,
        email,
        password: hashedPassword,
        profileTypeId,
      },
    });

    const tokens = await this.getTokens(user.id, user.login);
    this.updateRefreshToken(user.id, tokens.refreshToken);
    // res.cookie['access_token'] = tokens.accessToken;
    // res.cookie['refresh_token'] = tokens.refreshToken;

    return tokens;
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
    // res.cookie['access_token'] = tokens.accessToken;
    // res.cookie['refresh_token'] = tokens.refreshToken;
    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: { id: userId },
      data: {
        refreshToken: null,
      },
    });
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
}
