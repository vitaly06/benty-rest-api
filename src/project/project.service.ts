import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
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
    // Логируем входные данные
    console.log('Создание проекта, userId:', userId);
    console.log('DTO:', { ...dto, content: typeof dto.content });

    // Парсим и валидируем контент
    let parsedContent;
    try {
      parsedContent = this.parseAndValidateContent(dto.content);
      console.log('Валидный контент:', JSON.stringify(parsedContent, null, 2));
    } catch (error) {
      console.error('Ошибка парсинга контента:', error.message);
      throw new BadRequestException(
        `Неверный формат контента: ${error.message}`,
      );
    }

    // Проверяем категорию и специализацию
    const [category, specialization] = await Promise.all([
      this.prisma.category.findUnique({ where: { id: +dto.categoryId } }),
      this.prisma.specialization.findUnique({
        where: { id: +dto.specializationId },
      }),
    ]);

    if (!category) throw new NotFoundException('Категория не найдена');
    if (!specialization)
      throw new NotFoundException('Специализация не найдена');

    // Сохраняем контент в файл
    const tempFileName = `project_temp_${Date.now()}.json`;
    let contentPath: string, contentSize: number, contentHash: string;
    try {
      const { path, size, hash } = await this.storageService.saveContent(
        tempFileName,
        parsedContent,
        'projects',
      );
      contentPath = path;
      contentSize = size;
      contentHash = hash;
      console.log(`Контент сохранен в: ${contentPath}`);
    } catch (error) {
      console.error('Ошибка сохранения контента:', error.message);
      throw new BadRequestException('Не удалось сохранить контент');
    }

    // Создаем проект в базе
    try {
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
          contentPath,
          contentSize,
          contentHash,
        },
      });

      // Переименовываем файл в project_<id>.json
      const finalFileName = `project_${project.id}.json`;
      await this.storageService.renameFile(
        contentPath,
        finalFileName,
        'projects',
      );
      console.log(`Файл переименован в: ${finalFileName}`);

      // Обновляем contentPath в базе
      return await this.prisma.project.update({
        where: { id: project.id },
        data: { contentPath: finalFileName },
        include: { user: true, category: true, specialization: true },
      });
    } catch (error) {
      // Очищаем временный файл при ошибке
      await this.storageService
        .deleteFile(contentPath, 'projects')
        .catch((err) =>
          console.error(`Ошибка удаления временного файла: ${err.message}`),
        );
      console.error('Ошибка создания проекта:', error.message);
      throw new BadRequestException('Не удалось создать проект');
    }
  }

  async updateProject(
    projectId: number,
    dto: UpdateProjectDto,
    userId: number,
    coverImage?: Express.Multer.File,
  ) {
    console.log(`Обновление проекта ${projectId}, userId: ${userId}`);
    console.log('DTO:', { ...dto, content: typeof dto.content });

    // Проверяем существование проекта и права доступа
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        userId: true,
        photoName: true,
        contentPath: true,
        contentSize: true,
        contentHash: true,
      },
    });

    if (!project) {
      throw new NotFoundException(`Проект с id ${projectId} не найден`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException(
        'Вы не авторизованы для редактирования этого проекта',
      );
    }

    // Парсим и валидируем контент, если передан
    let parsedContent;
    let newContentPath = project.contentPath;
    let newContentSize = project.contentSize;
    let newContentHash = project.contentHash;

    if (dto.content !== undefined) {
      try {
        parsedContent = this.parseAndValidateContent(dto.content);
        console.log(
          'Валидный контент:',
          JSON.stringify(parsedContent, null, 2),
        );
      } catch (error) {
        console.error(
          'Ошибка парсинга контента:',
          error.message,
          'dto.content:',
          dto.content,
        );
        throw new BadRequestException(
          `Неверный формат контента: ${error.message}`,
        );
      }

      // Сохраняем новый контент
      const fileName = project.contentPath || `project_${projectId}.json`;
      try {
        const { path, size, hash } = await this.storageService.saveContent(
          fileName,
          parsedContent,
          'projects',
        );
        newContentPath = path;
        newContentSize = size;
        newContentHash = hash;
        console.log(`Контент обновлен в: ${newContentPath}`);
      } catch (error) {
        console.error('Ошибка сохранения контента:', error.message);
        throw new BadRequestException('Не удалось сохранить контент');
      }
    } else {
      console.log('Контент не передан, сохраняется существующий');
    }

    // Проверяем категорию и специализацию, если переданы
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: +dto.categoryId },
      });
      if (!category) throw new NotFoundException('Категория не найдена');
    }

    if (dto.specializationId) {
      const specialization = await this.prisma.specialization.findUnique({
        where: { id: +dto.specializationId },
      });
      if (!specialization)
        throw new NotFoundException('Специализация не найдена');
    }

    // Обрабатываем изображение
    let newPhotoName = project.photoName;
    if (coverImage) {
      if (project.photoName) {
        await this.storageService
          .deleteFile(project.photoName, 'projects')
          .catch((err) =>
            console.error(
              `Ошибка удаления старого изображения: ${err.message}`,
            ),
          );
      }
      newPhotoName = coverImage.filename;
    }

    // Обновляем проект
    try {
      return await this.prisma.project.update({
        where: { id: projectId },
        data: {
          name: dto.name ?? undefined,
          description: dto.description ?? null,
          categoryId: dto.categoryId ? +dto.categoryId : undefined,
          specializationId: dto.specializationId
            ? +dto.specializationId
            : undefined,
          firstLink: dto.firstLink ?? null,
          secondLink: dto.secondLink ?? null,
          photoName: newPhotoName,
          contentPath: newContentPath,
          contentSize: newContentSize,
          contentHash: newContentHash,
        },
        include: { user: true, category: true, specialization: true },
      });
    } catch (error) {
      console.error('Ошибка обновления проекта:', error.message);
      throw new BadRequestException('Не удалось обновить проект');
    }
  }

  async getProjectContentForEdit(projectId: number, userId: number) {
    console.log(
      `Получение контента для редактирования проекта ${projectId}, userId: ${userId}`,
    );

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: true,
        category: true,
        specialization: true,
      },
    });

    if (!project) {
      throw new NotFoundException(`Проект с id ${projectId} не найден`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('Вы не можете редактировать этот проект');
    }

    let content: any[] | null = null;
    if (project.contentPath) {
      try {
        const fileContent = await this.storageService.loadContent(
          project.contentPath,
          'projects',
        );
        if (fileContent) {
          content = fileContent; // Убираем JSON.parse, так как fileContent уже распарсен
          this.validateSlateContent(content);
          console.log('Загруженный контент:', JSON.stringify(content, null, 2));
        } else {
          console.warn(`Файл ${project.contentPath} пуст или содержит null`);
        }
      } catch (error) {
        console.error(
          `Ошибка загрузки или валидации контента для проекта ${projectId}: ${error.message}`,
        );
        content = null;
      }
    } else {
      console.warn(`Контент отсутствует для проекта ${projectId}`);
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description || null,
      specializationId: project.specializationId,
      categoryId: project.categoryId,
      firstLink: project.firstLink || null,
      secondLink: project.secondLink || null,
      content,
      photoName: project.photoName || null,
    };
  }

  async deleteProject(projectId: number, userId: number) {
    console.log(`Удаление проекта ${projectId}, userId: ${userId}`);

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        userId: true,
        photoName: true,
        contentPath: true,
      },
    });

    if (!project) {
      throw new NotFoundException(`Проект с id ${projectId} не найден`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException(
        'Вы не авторизованы для удаления этого проекта',
      );
    }

    // Удаляем файлы
    if (project.photoName) {
      await this.storageService
        .deleteFile(project.photoName, 'projects')
        .catch((err) =>
          console.error(`Ошибка удаления изображения: ${err.message}`),
        );
    }

    if (project.contentPath) {
      await this.storageService
        .deleteFile(project.contentPath, 'projects')
        .catch((err) =>
          console.error(`Ошибка удаления контента: ${err.message}`),
        );
    }

    try {
      return await this.prisma.project.delete({
        where: { id: projectId },
      });
    } catch (error) {
      console.error('Ошибка удаления проекта:', error.message);
      throw new BadRequestException('Не удалось удалить проект');
    }
  }

  async getPopularProjects() {
    console.log('Получение популярных проектов');

    try {
      const projects = await this.prisma.project.findMany({
        take: 4,
        include: {
          user: {
            include: {
              specializations: true,
              subscription: true,
            },
          },
          category: true,
          _count: {
            select: {
              likedBy: true,
              viewedBy: true,
            },
          },
        },
      });

      const sortedProjects = projects.sort((a, b) => {
        const aPopularity = a._count.likedBy + a._count.viewedBy;
        const bPopularity = b._count.likedBy + b._count.viewedBy;
        return bPopularity - aPopularity;
      });

      return sortedProjects.map((project) =>
        this.mapToProjectResponse(project),
      );
    } catch (error) {
      console.error('Ошибка получения популярных проектов:', error.message);
      throw new BadRequestException('Не удалось получить популярные проекты');
    }
  }

  async getProjectWithContent(
    projectId: number,
    req: Request & { user?: { sub: number } },
  ) {
    console.log(`Получение проекта ${projectId} с контентом`);

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
        viewedBy: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        specialization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Проект с id ${projectId} не найден`);
    }

    let content: any[] | null = null;
    if (project.contentPath) {
      try {
        const fileContent = await this.storageService.loadContent(
          project.contentPath,
          'projects',
        );
        if (fileContent) {
          content = fileContent; // Убираем JSON.parse, так как fileContent уже распарсен
          this.validateSlateContent(content);
          console.log('Загруженный контент:', JSON.stringify(content, null, 2));
        } else {
          console.warn(`Файл ${project.contentPath} пуст или содержит null`);
        }
      } catch (error) {
        console.error(
          `Ошибка загрузки или валидации контента для проекта ${projectId}: ${error.message}`,
        );
        content = null;
      }
    } else {
      console.warn(`Контент отсутствует для проекта ${projectId}`);
    }

    const anotherProjects = await this.getUserProjects(project.user.id);

    const result = {
      id: project.id,
      name: project.name,
      description: project.description,
      photoName: project.photoName,
      firstLink: project.firstLink,
      secondLink: project.secondLink,
      contentPath: project.contentPath,
      contentSize: project.contentSize,
      user: {
        id: project.user.id,
        fullName: project.user.fullName,
        login: project.user.login,
        logoFileName: project.user.logoFileName,
        city: project.user.city,
      },
      category: project.category
        ? {
            id: project.category.id,
            name: project.category.name,
          }
        : null,
      specialization: project.specialization
        ? {
            id: project.specialization.id,
            name: project.specialization.name,
          }
        : null,
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

    if (req.user?.sub) {
      const checkView = await this.prisma.project.findFirst({
        where: {
          id: projectId,
          viewedBy: {
            some: {
              id: req.user.sub,
            },
          },
        },
      });
      if (!checkView) {
        await this.prisma.project.update({
          where: { id: projectId },
          data: {
            viewedBy: {
              connect: { id: req.user.sub },
            },
          },
        });
      }
    }

    return result;
  }

  async getProjectsForMainPage() {
    console.log('Получение проектов для главной страницы');

    try {
      const projects = await this.prisma.project.findMany({
        take: 8,
        orderBy: {
          id: 'desc',
        },
        include: {
          user: {
            include: {
              specializations: true,
              subscription: true,
            },
          },
          category: true,
        },
      });

      return projects.map((project) => this.mapToProjectResponse(project));
    } catch (error) {
      console.error('Ошибка получения проектов:', error.message);
      throw new BadRequestException('Не удалось получить проекты');
    }
  }

  async getAllProjects() {
    console.log('Получение всех проектов');

    try {
      const projects = await this.prisma.project.findMany({
        include: {
          user: {
            include: {
              specializations: true,
              subscription: true,
            },
          },
          category: true,
        },
      });

      return projects.map((project) => this.mapToProjectResponse(project));
    } catch (error) {
      console.error('Ошибка получения всех проектов:', error.message);
      throw new BadRequestException('Не удалось получить проекты');
    }
  }

  async likeProject(projectId: number, userId: number) {
    console.log(`Лайк проекта ${projectId} пользователем ${userId}`);

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Проект с id ${projectId} не найден`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с id ${userId} не найден`);
    }

    try {
      return await this.prisma.project.update({
        where: { id: projectId },
        data: {
          likedBy: {
            connect: { id: userId },
          },
        },
      });
    } catch (error) {
      console.error('Ошибка лайка проекта:', error.message);
      throw new BadRequestException('Не удалось лайкнуть проект');
    }
  }

  async unlikeProject(projectId: number, userId: number) {
    console.log(`Снятие лайка с проекта ${projectId} пользователем ${userId}`);

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Проект с id ${projectId} не найден`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с id ${userId} не найден`);
    }

    try {
      return await this.prisma.project.update({
        where: { id: projectId },
        data: {
          likedBy: {
            disconnect: { id: userId },
          },
        },
      });
    } catch (error) {
      console.error('Ошибка снятия лайка:', error.message);
      throw new BadRequestException('Не удалось снять лайк с проекта');
    }
  }

  async getUserProjects(userId: number) {
    console.log(`Получение проектов пользователя ${userId}`);

    try {
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
            },
          },
        },
      });

      return projects.map((project) => ({
        id: project.id,
        name: project.name,
        photoName: project.photoName,

        category: project.category?.name || 'Категория не указана',
        userLogo: project.user?.logoFileName,
        fullName: project.user?.fullName,
      }));
    } catch (error) {
      console.error('Ошибка получения проектов пользователя:', error.message);
      throw new BadRequestException('Не удалось получить проекты пользователя');
    }
  }

  private parseAndValidateContent(content: any): any[] {
    if (!content) {
      throw new Error('Контент не передан');
    }

    let parsedContent;
    if (typeof content === 'string') {
      if (
        content === 'null' ||
        content === 'undefined' ||
        content.startsWith('[object Obj')
      ) {
        throw new Error(`Некорректная строка контента: ${content}`);
      }
      try {
        parsedContent = JSON.parse(content);
      } catch (error) {
        throw new Error(`Ошибка парсинга JSON: ${error.message}`);
      }
    } else if (Array.isArray(content)) {
      parsedContent = content;
    } else {
      throw new Error('Контент должен быть массивом или строкой JSON');
    }

    if (!Array.isArray(parsedContent)) {
      throw new Error('Контент должен быть массивом');
    }

    this.validateSlateContent(parsedContent);
    return parsedContent;
  }

  private validateSlateContent(content: any[]): void {
    if (!content.length) {
      throw new Error('Контент должен быть непустым массивом');
    }

    for (const node of content) {
      this.validateSlateNode(node);
    }
  }

  private validateSlateNode(node: any): void {
    if (!node || typeof node !== 'object') {
      throw new Error('Узел должен быть объектом');
    }

    if (node.text !== undefined) {
      if (typeof node.text !== 'string') {
        throw new Error(
          'Текстовый узел должен содержать строковое свойство text',
        );
      }
      const validTextProps = [
        'text',
        'fontSize',
        'color',
        'bold',
        'italic',
        'underline',
        'fontFamily',
      ];
      for (const key of Object.keys(node)) {
        if (!validTextProps.includes(key)) {
          throw new Error(`Недопустимое свойство ${key} в текстовом узле`);
        }
      }
      return;
    }

    if (!node.type || typeof node.type !== 'string') {
      throw new Error('Элемент должен содержать строковое свойство type');
    }

    if (!node.children || !Array.isArray(node.children)) {
      throw new Error('Элемент должен содержать массив children');
    }

    const validTypes = ['title', 'description', 'paragraph', 'image'];
    if (!validTypes.includes(node.type)) {
      throw new Error(`Недопустимый тип узла: ${node.type}`);
    }

    if (node.type === 'image' && (!node.url || typeof node.url !== 'string')) {
      throw new Error(
        'Узел типа image должен содержать строковое свойство url',
      );
    }

    for (const child of node.children) {
      this.validateSlateNode(child);
    }
  }

  private mapToProjectResponse(project: any) {
    return {
      id: project.id,
      name: project.name,
      coverImage: project.photoName,
      contentPath: project.contentPath,
      author: {
        id: project.user.id,
        name: project.user.fullName,
        avatar: project.user.logoFileName,
        specializations: project.user.specializations.map((spec) => spec.name),
        subscription: project.user.subscription?.name || 'Нет подписки',
      },
      category: {
        id: project.category.id,
        name: project.category.name,
      },
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
