import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { User } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateMainSettingsRequest } from './dto/update-main-settings.dto';
import * as path from 'path';
import * as fs from 'fs';
import { UpdateNotificationsSettingsRequest } from './dto/update-notifications-settings.dto';
import { ChangeLoginRequest } from './dto/change-login.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtPayload } from 'src/auth/interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ChangeEmailRequest } from './dto/change-email.dto';
import { NotFoundError } from 'rxjs';
import { ChangePhoneRequest } from './dto/change-phone.dto';
import { ChangePasswordRequest } from './dto/change-password';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findByLogin(login: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { login },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getBestSpecialists() {
    // Все категории
    const categories = [];

    const result = [];

    const users = await this.prisma.user.findMany({
      take: 3,
      select: {
        id: true,
        fullName: true,
        logoFileName: true,
        city: true,
        projects: {
          select: {
            id: true,
            name: true,
            photoName: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    for (const user of users) {
      // проекты пользователя
      const projects = [];
      for (const project of user.projects) {
        projects.push({
          id: project.id,
          name: project.name,
          photoName: project.photoName,
          category: project.category.name,
        });

        if (!categories.includes(project.category.name)) {
          categories.push(project.category.name);
        }
      }
      result.push({
        id: user.id,
        fullName: user.fullName,
        logoFileName: user.logoFileName,
        city: user.city,
        projects,
        categories,
      });
    }

    return result;
  }

  async getMainSettings(req: RequestWithUser) {
    const sub = req.user.sub;

    const user = await this.prisma.user.findUnique({
      where: { id: sub },
      select: {
        id: true,
        fullName: true,
        city: true,
        specializations: {
          select: {
            id: true,
          },
        },
        level: true,
        experience: true,
        about: true,
        website: true,
        phoneNumber: true,
        email: true,
        vk: true,
        telegram: true,
      },
    });
    if (!user) {
      throw new BadRequestException('Данного пользователя не существует');
    }

    const nameInfo = user.fullName.split(' ');
    return {
      id: user.id,
      name: nameInfo[0] || '',
      surname: nameInfo[1] || '',
      city: user.city,
      specializations: user.specializations?.map((spec) => spec.id) || [],
      level: user.level,
      experience: user.experience,
      about: user.about,
      website: user.website,
      phoneNumber: user.phoneNumber,
      email: user.email,
      vk: user.vk,
      telegram: user.telegram,
    };
  }

  async updateMainSettings(
    dto: updateMainSettingsRequest,
    req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    // Создаем объект для обновления
    const updateData: any = {
      fullName: dto.fullName,
      city: dto.city,
      level: dto.level,
      experience: dto.experience,
      about: dto.about,
      website: dto.website,
      phoneNumber: dto.phoneNumber,
      email: dto.email,
      vk: dto.vk,
      telegram: dto.telegram,
    };

    // Очищаем объект от undefined полей
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    // Обновляем основные данные пользователя
    await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Обрабатываем специализации, если они переданы
    if (
      dto.firstSpecializationId ||
      dto.secondSpecializationId ||
      dto.thirdSpecializationId
    ) {
      // Сначала удаляем все текущие специализации пользователя
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          specializations: {
            set: [], // Очищаем все связи
          },
        },
      });

      const specializationIds = [
        dto.firstSpecializationId,
        dto.secondSpecializationId,
        dto.thirdSpecializationId,
      ]
        .filter((id): id is number => id !== undefined && id !== null)
        .filter((id, index, self) => self.indexOf(id) === index); // Удаляем дубликаты

      // Добавляем новые специализации
      if (specializationIds.length > 0) {
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            specializations: {
              connect: specializationIds.map((id) => ({ id })),
            },
          },
        });
      }
    }

    return { message: 'Основные настройки успешно обновлены' };
  }

  async getDecorSettings(req: RequestWithUser) {
    return await this.prisma.user.findUnique({
      where: { id: req.user.sub },
      select: {
        id: true,
        logoFileName: true,
        coverFileName: true,
      },
    });
  }

  async updateAvatar(fileName: string, req: RequestWithUser) {
    // Сначала получаем текущий файл аватарки, чтобы потом его удалить
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { logoFileName: true },
    });

    // Обновляем аватарку в базе
    const updatedUser = await this.prisma.user.update({
      where: { id: req.user.sub },
      data: { logoFileName: fileName },
    });

    // Удаляем старый файл, если он существует
    if (user.logoFileName) {
      const filePath = path.join('./uploads/avatars', user.logoFileName);
      this.deleteFileIfExists(filePath);
    }

    return updatedUser;
  }

  async updateCover(fileName: string, req: RequestWithUser) {
    // Аналогично для обложки
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { coverFileName: true },
    });

    const updatedUser = await this.prisma.user.update({
      where: { id: req.user.sub },
      data: { coverFileName: fileName },
    });

    if (user.coverFileName) {
      const filePath = path.join('./uploads/covers', user.coverFileName);
      this.deleteFileIfExists(filePath);
    }

    return updatedUser;
  }

  async deleteAvatar(req: RequestWithUser) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { logoFileName: true },
    });

    const updatedUser = await this.prisma.user.update({
      where: { id: req.user.sub },
      data: { logoFileName: null },
    });

    if (user.logoFileName) {
      const filePath = path.join('./uploads/avatars', user.logoFileName);
      this.deleteFileIfExists(filePath);
    }

    return updatedUser;
  }

  async deleteCover(req: RequestWithUser) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { coverFileName: true },
    });

    const updatedUser = await this.prisma.user.update({
      where: { id: req.user.sub },
      data: { coverFileName: null },
    });

    if (user.coverFileName) {
      const filePath = path.join('./uploads/covers', user.coverFileName);
      this.deleteFileIfExists(filePath);
    }

    return updatedUser;
  }

  private deleteFileIfExists(filePath: string) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error('Ошибка при удалении файла:', err);
    }
  }

  async getNotificationsSettings(req: RequestWithUser) {
    return await this.prisma.user.findUnique({
      where: { id: req.user.sub },
      select: {
        id: true,
        rewardNotifications: true,
        weeklySummaryNotifications: true,
        joinAuthorsNotifications: true,
      },
    });
  }

  async updateNotificationsSettings(
    req: RequestWithUser,
    dto: UpdateNotificationsSettingsRequest,
  ) {
    return await this.prisma.user.update({
      where: { id: req.user.sub },
      data: {
        ...dto,
      },
    });
  }

  async getAvatar(userId: number) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        logoFileName: true,
      },
    });
  }

  async changeLogin(dto: ChangeLoginRequest, req: RequestWithUser) {
    const checkAvailableLogin = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });
    if (checkAvailableLogin) {
      throw new BadRequestException('Данный логин уже занят');
    }
    const verificationCode = await this.generateVerifyCode();
    console.log(verificationCode);
    await this.cacheManager.set(
      `login-change:${req.user.sub}`,
      JSON.stringify({
        newLogin: dto.login,
        code: verificationCode.toString(),
      }),
      0,
    );

    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
    });

    await this.sendVerificationEmail(
      user.email,
      'Смена логина',
      verificationCode,
      './change-login',
    );
    return { message: 'Код подтверждения отправлен на вашу почту' };
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

  async verifyLoginCode(code: string, req: RequestWithUser) {
    const cachedDataStr = await this.cacheManager.get<string>(
      `login-change:${req.user.sub}`,
    );
    const cachedData = cachedDataStr ? JSON.parse(cachedDataStr) : null;

    if (!cachedData) {
      console.log('Данные не найдены в кеше');
    }
    if (cachedData.code !== code) {
      throw new BadRequestException('Неверный код подтверждения');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
    });

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    if (user.lastLoginUpdate) {
      if (user.lastLoginUpdate > oneMonthAgo) {
        throw new BadRequestException('Логин можно менять только раз в месяц');
      }
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: req.user.sub },
      data: {
        login: cachedData.newLogin,
        lastLoginUpdate: new Date(),
      },
    });

    await this.cacheManager.del(`login-change:${req.user.sub}`);
    const tokens = await this.getTokens(updatedUser.id, updatedUser.login);
    await this.updateRefreshToken(updatedUser.id, tokens.refreshToken);

    return tokens;
  }

  async changeEmail(dto: ChangeEmailRequest, req: RequestWithUser) {
    const { email } = { ...dto };
    const currentUser = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
    });
    const verificationCode = await this.generateVerifyCode();

    await this.cacheManager.set(
      `change-email:${req.user.sub}`,
      JSON.stringify({
        newEmail: email,
        code: verificationCode,
      }),
    );

    await this.sendVerificationEmail(
      currentUser.email,
      'Смена почты',
      verificationCode,
      './change-email',
    );
  }

  async verifyOldEmailCode(code: string, req: RequestWithUser) {
    const cachedDataStr = await this.cacheManager.get<string>(
      `change-email:${req.user.sub}`,
    );
    const cachedData = cachedDataStr ? JSON.parse(cachedDataStr) : null;

    if (!cachedData) {
      console.log('Данные не найдены в кеше');
    }
    if (cachedData.code !== code) {
      throw new BadRequestException('Неверный код подтверждения');
    }

    await this.prisma.user.update({
      where: { id: req.user.sub },
      data: {
        isEmailVerified: false,
      },
    });
    const newVerificationCode = await this.generateVerifyCode();

    await this.sendVerificationEmail(
      cachedData.newEmail,
      'Подтверждение новой почты',
      newVerificationCode,
      './verify-new-email.hbs',
    );

    cachedData.code = newVerificationCode;
    await this.cacheManager.set(
      `change-email:${req.user.sub}`,
      JSON.stringify(cachedData),
    );
  }

  async verifyNewEmailCode(code: string, req: RequestWithUser) {
    const cachedDataStr = await this.cacheManager.get<string>(
      `change-email:${req.user.sub}`,
    );
    const cachedData = cachedDataStr ? JSON.parse(cachedDataStr) : null;

    if (!cachedData) {
      throw new NotFoundError('Данные не найдены в кеше');
    }
    if (cachedData.code !== code) {
      throw new BadRequestException('Неверный код подтверждения');
    }

    await this.prisma.user.update({
      where: { id: req.user.sub },
      data: {
        email: cachedData.newEmail,
        isEmailVerified: true,
      },
    });

    await this.cacheManager.del(`change-email:${req.user.sub}`);

    return { message: 'Почта успешно обновлена' };
  }

  async changePhone(dto: ChangePhoneRequest, req: RequestWithUser) {
    const currentUser = await this.findById(req.user.sub);

    const code = await this.generateVerifyCode();

    await this.cacheManager.set(
      `change-phone:${req.user.sub}`,
      JSON.stringify({
        newPhoneNumber: dto.phoneNumber,
        code,
      }),
      0,
    );

    await this.sendVerificationEmail(
      currentUser.email,
      'Смена номера телефона',
      code,
      './change-phone',
    );
  }

  async verifyPhoneEmailCode(code: string, req: RequestWithUser) {
    const cachedDataStr = await this.cacheManager.get<string>(
      `change-phone:${req.user.sub}`,
    );
    const cachedData = cachedDataStr ? JSON.parse(cachedDataStr) : null;

    if (!cachedData) {
      console.log('Данные не найдены в кеше');
    }
    if (cachedData.code !== code) {
      throw new BadRequestException('Неверный код подтверждения');
    }

    await this.prisma.user.update({
      where: { id: req.user.sub },
      data: {
        phoneNumber: cachedData.newPhoneNumber,
      },
    });

    await this.cacheManager.del(`change-phone:${req.user.sub}`);

    return { message: 'Номер телефона успешно изменён' };
  }

  async changePassword(dto: ChangePasswordRequest, req: RequestWithUser) {
    const { currentPassword, newPassword, newRepassword } = { ...dto };

    if (newPassword != newRepassword) {
      throw new BadRequestException('Пароли не совпадают');
    }

    const currentUser = await this.findById(req.user.sub);
    const code = await this.generateVerifyCode();

    const matchPassword = await bcrypt.compare(
      currentPassword,
      currentUser.password,
    );
    if (!matchPassword) {
      throw new BadRequestException('Неверный текущий пароль');
    }

    await this.cacheManager.set(
      `change-settings-password:${req.user.sub}`,
      JSON.stringify({
        newPassword: dto.newPassword,
        code,
      }),
    );

    await this.sendVerificationEmail(
      currentUser.email,
      'Смена пароля',
      code,
      './change-settings-password',
    );
  }

  async verifyChangePasswordCode(code: string, req: RequestWithUser) {
    const cachedDataStr = await this.cacheManager.get<string>(
      `change-settings-password:${req.user.sub}`,
    );
    const cachedData = cachedDataStr ? JSON.parse(cachedDataStr) : null;

    if (!cachedData) {
      console.log('Данные не найдены в кеше');
    }
    if (cachedData.code !== code) {
      throw new BadRequestException('Неверный код подтверждения');
    }

    await this.prisma.user.update({
      where: { id: req.user.sub },
      data: {
        password: await bcrypt.hash(cachedData.newPassword, 10),
      },
    });

    await this.cacheManager.del(`change-settings-password:${req.user.sub}`);

    return { message: 'Пароль успешно изменён' };
  }

  async generateVerifyCode(): Promise<string> {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Генерирует 6 цифр (от 100000 до 999999)
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.findById(userId);
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
