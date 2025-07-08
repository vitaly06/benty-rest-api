import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateMainSettingsRequest } from './dto/update-main-settings.dto';
import * as path from 'path';
import * as fs from 'fs';
import { UpdateNotificationsSettingsRequest } from './dto/update-notifications-settings.dto';
import { ChangeLoginRequest } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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

  async changeLogin(dto: ChangeLoginRequest, req: RequestWithUser) {}
}
