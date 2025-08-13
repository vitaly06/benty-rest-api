import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ChangeEmailRequest } from './dto/change-email.dto';
import { NotFoundError } from 'rxjs';
import { ChangePhoneRequest } from './dto/change-phone.dto';
import { ChangePasswordRequest } from './dto/change-password';
import { ProjectService } from 'src/project/project.service';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly projectService: ProjectService,
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

  async getBestSpecialists(req: Request & { user?: { sub: number } }) {
    // Все категории
    const categories = [];

    let result = [];

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        logoFileName: true,
        city: true,
        website: true,
        favoritedBy: true,
        followers: true,
        subscription: {
          select: {
            id: true,
            name: true,
            ratingBoost: true,
          },
        },
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
        subscription: user.subscription.name,
        info: {
          rating: await this.calculateRating(user.id),
          followers: user.followers.length,
          website: user.website || null,
        },
        isFavorited: req?.user
          ? user.favoritedBy.some(
              (user) => String(user.id) === String(req.user.sub),
            )
          : false,
        city: user.city,
        projects,
        categories,
      });
    }

    result = result
      .filter((item) => item.projects.length != 0)
      .sort((a, b) => b.info.rating - a.info.rating);
    return result.length < 3 ? result : result.slice(0, 3);
  }

  async getAllSpecialists(req?: Request & { user?: { sub: number } }) {
    // Все категории
    const categories = [];

    const result = [];

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        logoFileName: true,
        city: true,
        favoritedBy: true,
        followers: true,
        website: true,
        subscription: {
          select: {
            id: true,
            name: true,
          },
        },
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
      if (user.projects.length == 0) {
        continue;
      }
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
        subscription: user.subscription.name,
        info: {
          rating: await this.calculateRating(user.id),
          followers: user.followers.length,
          website: user.website || null,
        },
        isFavorited: req?.user
          ? user.favoritedBy.some(
              (user) => String(user.id) === String(req.user.sub),
            )
          : false,
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

    // Безопасное разбиение имени на части
    const nameParts = user.fullName?.trim().split(/\s+/) || [];
    const name = nameParts[0] || '';
    const surname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    return {
      id: user.id,
      name: name,
      surname: surname,
      city: user.city || '',
      specializations: user.specializations?.map((spec) => spec.id) || [],
      level: user.level || '',
      experience: user.experience || '',
      about: user.about || '',
      website: user.website || '',
      phoneNumber: user.phoneNumber || '',
      email: user.email || '',
      vk: user.vk || '',
      telegram: user.telegram || '',
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
      3600,
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

    const checkUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (checkUser) {
      throw new BadRequestException('Данная почта уже занята');
    }
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
      3600,
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

  async getProfile(userId: number, req?: Request & { user?: { sub: number } }) {
    let result = {};
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        login: true,
        fullName: true,
        subscription: true,
        specializations: true,
        city: true,
        logoFileName: true,
        coverFileName: true,
        favoritedBy: true,
        likedBy: true,
        followers: true,
        phoneNumber: true,
        email: true,
        website: true,
        vk: true,
        telegram: true,
        experience: true,
        profileType: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        about: true,
        following: true,
      },
    });

    if (!currentUser) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    result = {
      id: currentUser.id,
      login: currentUser.login || null,
      fullName: currentUser.fullName || null,
      subscription: currentUser.subscription.name,
      specialization:
        currentUser.specializations?.[0]?.name || 'Специализации не указаны',
      city: currentUser.city || 'Город не указан',
      logoFileName: currentUser.logoFileName || null,
      coverFileName: currentUser.coverFileName || null,
      favorited: currentUser.favoritedBy?.length || 0,
      likes: currentUser.likedBy?.length || 0,
      followers: currentUser.followers?.length || 0,
      isFollow: req?.user
        ? currentUser.followers.some(
            (user) => String(user.id) === String(req.user.sub),
          )
        : false,
      projects: [],
      info: {
        phoneNumber: currentUser.phoneNumber || null,
        email: currentUser.email,
        website: currentUser.website || null,
        vk: currentUser.vk || null,
        telegram: currentUser.telegram || null,
        city: currentUser.city,
        experience: currentUser.experience || null,
        type: currentUser.profileType?.name || 'Тип не указан',
        createdAt: await this.formatDateTimePeriod(
          currentUser.createdAt.toString(),
        ),
        about: currentUser.about || null,
      },
      followings: await this.getSubscriptions(userId),
    };

    // Проекты пользователя
    result['projects'] = await this.projectService.getUserProjects(
      currentUser.id,
    );

    return result;
  }

  async subscribeUser(userId: number, req: RequestWithUser) {
    if (userId === req.user.sub) {
      throw new BadRequestException('Нельзя подписаться на самого себя');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    const existingSubscription = await this.prisma.user.findFirst({
      where: {
        id: req.user.sub,
        following: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (existingSubscription) {
      throw new ConflictException('Вы уже подписаны на этого пользователя');
    }

    await this.prisma.user.update({
      where: {
        id: req.user.sub,
      },
      data: {
        following: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        following: true,
      },
    });
    return { message: 'Пользователь успешно добавлен в ваши подписки' };
  }

  async unsubscribeUser(userId: number, req: RequestWithUser) {
    await this.prisma.user.update({
      where: {
        id: req.user.sub,
      },
      data: {
        following: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
    return { message: 'Пользователь успешно удалён из ваших подписок' };
  }

  async favoriteUser(userId: number, req: RequestWithUser) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    const existingFavorite = await this.prisma.user.findFirst({
      where: {
        id: req.user.sub,
        favorites: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (existingFavorite) {
      throw new ConflictException(
        'Вы уже добавили в избранное этого пользователя',
      );
    }

    await this.prisma.user.update({
      where: {
        id: req.user.sub,
      },
      data: {
        favorites: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        favorites: true,
      },
    });

    return { message: 'Пользователь успешно добавлен в ваше избранное' };
  }

  async unfavoriteUser(userId: number, req: RequestWithUser) {
    await this.prisma.user.update({
      where: {
        id: req.user.sub,
      },
      data: {
        favorites: {
          disconnect: {
            id: userId,
          },
        },
      },
    });

    return { message: 'Пользователь успешно удалён из вашего избранного' };
  }

  async likeUser(userId: number, req: RequestWithUser) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    const existingLike = await this.prisma.user.findFirst({
      where: {
        id: req.user.sub,
        likedUser: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (existingLike) {
      throw new ConflictException('Вы уже поставили лайк этому пользователю');
    }

    await this.prisma.user.update({
      where: {
        id: req.user.sub,
      },
      data: {
        likedUser: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        likedUser: true,
      },
    });

    return { message: 'Вы успешно добавили пользователя в понравившееся' };
  }

  async unlikeUser(userId: number, req: RequestWithUser) {
    await this.prisma.user.update({
      where: {
        id: req.user.sub,
      },
      data: {
        likedUser: {
          disconnect: {
            id: userId,
          },
        },
      },
    });

    return { message: 'Вы успешно удалили пользователя из понравившегося' };
  }
  // Подписки пользователя
  async getSubscriptions(userId: number) {
    const userWithSubscriptions = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        following: {
          where: {
            projects: {
              some: {},
            },
          },
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
        },
      },
    });

    if (!userWithSubscriptions) {
      throw new NotFoundException('Пользователь не найден');
    }
    const categories = new Set<string>();

    const subscriptions = userWithSubscriptions.following.map((user) => {
      const projects = user.projects.map((project) => {
        const categoryName = project.category.name;
        categories.add(categoryName);

        return {
          id: project.id,
          name: project.name,
          photoName: project.photoName,
          category: categoryName,
        };
      });

      return {
        id: user.id,
        fullName: user.fullName,
        logoFileName: user.logoFileName,
        city: user.city,
        projects,
      };
    });

    return {
      subscriptions,
      categories: Array.from(categories),
    };
  }
  async generateVerifyCode(): Promise<string> {
    return Math.floor(100000 + Math.random() * 900000).toString();
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

  async getTokens(userId: number, login: string) {
    const payload = { sub: userId, login };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      }),
    };
  }

  private async calculateRating(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: true,
        subscription: true,
        projects: {
          select: {
            viewedBy: true,
            likedBy: true,
          },
        },
      },
    });
    // rating = (viewedBy + followers + likes) + boostRating
    const likes = user.projects.reduce(
      (sum, elem) => (sum += elem.likedBy.length),
      0,
    );

    const views = user.projects.reduce(
      (sum, elem) => (sum += elem.viewedBy.length),
      0,
    );
    const rating = views + likes + user.followers.length;

    return rating * (1 + user.subscription.ratingBoost / 100);
  }

  private formatDateTimePeriod(dateTimeStr: string): string {
    const date = new Date(dateTimeStr);
    const now = new Date();

    // Разница в миллисекундах
    const diffMs = now.getTime() - date.getTime();

    // Конвертируем в дни
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Если больше года (365 дней)
    if (diffDays >= 365) {
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;
      const months = Math.floor(remainingDays / 30);

      if (months > 0) {
        return `${years} год. ${months} мес.`;
      } else {
        return `${years} год.`;
      }
    }
    // Если больше месяца (30 дней)
    else if (diffDays >= 30) {
      const months = Math.floor(diffDays / 30);
      return `${months} мес.`;
    }
    // Если меньше месяца
    else {
      return `${diffDays} дн.`;
    }
  }
}
