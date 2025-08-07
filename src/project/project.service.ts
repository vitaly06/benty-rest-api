import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { StorageService } from 'src/storage/storage.service';
import { Request } from 'express';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async createProject(
    dto: CreateProjectDto,
    userId: number,
    coverImage?: Express.Multer.File,
  ) {
    // 1. Проверяем существование связанных сущностей
    const [category, specialization] = await Promise.all([
      this.prisma.category.findUnique({ where: { id: +dto.categoryId } }),
      this.prisma.specialization.findUnique({
        where: { id: +dto.specializationId },
      }),
    ]);
    if (!category) throw new NotFoundException('Category not found');
    if (!specialization)
      throw new NotFoundException('Specialization not found');

    // 2. Сначала сохраняем контент в файл (ВНИМАНИЕ: до создания проекта!)
    const tempFileName = `temp_${Date.now()}.json`;
    const { path, size, hash } = await this.storageService.saveContent(
      tempFileName,
      dto.content,
    );

    console.log(coverImage?.filename);

    try {
      // 3. Создаем проект (БЕЗ передачи content в Prisma)
      const project = await this.prisma.project.create({
        data: {
          name: dto.name,
          description: dto.description || null,
          userId: +userId,
          photoName: coverImage?.filename || null,
          categoryId: +dto.categoryId,
          specializationId: +dto.specializationId,
          firstLink: dto.firstLink || null,
          secondLink: dto.secondLink || null,
          contentPath: path,
          contentSize: size,
          contentHash: hash,
        },
      });

      // 4. Переименовываем файл с учетом ID проекта
      const newFileName = `project_${project.id}.json`;
      await this.storageService.renameFile(path, newFileName);

      return this.prisma.project.update({
        where: { id: project.id },
        data: { contentPath: newFileName },
        include: { user: true, category: true, specialization: true },
      });
    } catch (error) {
      // Удаляем временный файл при ошибке
      await this.storageService.deleteFile(path).catch(console.error);
      throw error;
    }
  }

  async getProjectWithContent(
    projectId: number,
    req: Request & { user?: { sub: number } },
  ) {
    // Получаем проект
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        description: true,
        photoName: true,
        firstLink: true,
        secondLink: true,
        contentPath: true,
        contentSize: true,
        user: {
          select: {
            id: true,
            fullName: true,
            login: true,
            logoFileName: true,
            city: true,
          },
        },
        likedBy: {
          select: {
            id: true,
            logoFileName: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Проект с таким id не найден');
    }

    // Получаем контент
    const content = project.contentPath
      ? await this.storageService.loadContent(project.contentPath)
      : null;

    // Дополнительно проекты пользователя
    const anotherProjects = await this.getUserProjects(project.user.id);
    console.log('Current user sub:', req.user?.sub);
    console.log(
      'LikedBy users:',
      project.likedBy.map((u) => u.id),
    );
    // Форматируем результат
    const result = {
      ...project,
      likedBy:
        project.likedBy.length > 5
          ? project.likedBy.slice(0, 5)
          : project.likedBy,
      isLiked: req.user
        ? project.likedBy.some(
            (user) => String(user.id) === String(req.user.sub),
          )
        : false,
      projects:
        anotherProjects.length <= 6
          ? anotherProjects
          : anotherProjects.slice(0, 6),
      content,
    };

    // if (req.user) {
    //   result['isLiked'] = project.likedBy.some(
    //     (user) => user.id == req.user.sub,
    //   );
    // } else {
    //   result['isLiked'] = false;
    // }

    return result;
  }

  async deleteProject(projectId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { contentPath: true },
    });

    if (project?.contentPath) {
      await this.storageService.deleteFile(project.contentPath);
    }

    return this.prisma.project.delete({ where: { id: projectId } });
  }

  async getProjectsForMainPage() {
    try {
      const projects = await this.prisma.project.findMany({
        take: 8,
        include: {
          user: {
            include: {
              specializations: true,
            },
          },
          category: true,
        },
      });

      return projects.map((project) => this.mapToProjectResponse(project));
    } catch (error) {
      throw new Error(`Failed to get projects: ${error.message}`);
    }
  }

  private mapToProjectResponse(project: any) {
    return {
      id: project.id,
      name: project.name,
      coverImage: project.photoName,
      contentPath: project.contentPath, // Теперь возвращаем путь к контенту
      author: {
        id: project.user.id,
        name: project.user.fullName,
        avatar: project.user.logoFileName,
        specializations: project.user.specializations.map((spec) => spec.name),
      },
      category: {
        id: project.category.id,
        name: project.category.name,
      },
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  async likeProject(projectId: number, userId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Проект с таким id не найден');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Пользователь с таким id не найден');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        likedBy: {
          connect: { id: userId },
        },
      },
    });
  }

  async unlikeProject(projectId: number, userId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Проект с таким id не найден');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Пользователь с таким id не найден');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        likedBy: {
          disconnect: { id: userId },
        },
      },
    });
  }

  async getUserProjects(userId: number) {
    const result = [];

    const projects = await this.prisma.project.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        photoName: true,
        category: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            fullName: true,
            logoFileName: true,
            profileType: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    for (const project of projects || []) {
      result.push({
        id: project.id,
        name: project.name,
        photoName: project.photoName,
        category: project.category?.name || 'Категория не указана',
        userLogo: project.user?.logoFileName,
        fullName: project.user?.fullName,
        profileType: project.user?.profileType?.name || 'Тип не указан',
      });
    }

    return result;
  }
}
