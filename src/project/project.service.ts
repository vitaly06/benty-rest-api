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
    console.log('Raw content received:', typeof dto.content);
    console.log(
      'Content length:',
      typeof dto.content === 'string'
        ? dto.content.length
        : JSON.stringify(dto.content).length,
    );

    let parsedContent;
    try {
      parsedContent =
        typeof dto.content === 'string' ? JSON.parse(dto.content) : dto.content;

      if (!Array.isArray(parsedContent)) {
        throw new Error('Content must be an array');
      }

      console.log(
        'Parsed content type:',
        Array.isArray(parsedContent) ? 'array' : typeof parsedContent,
      );
      console.log('Parsed content length:', parsedContent.length);

      this.analyzeSlateStructure(parsedContent);
      this.validateSlateContent(parsedContent);
    } catch (error) {
      throw new BadRequestException(`Invalid content format: ${error.message}`);
    }

    const [category, specialization] = await Promise.all([
      this.prisma.category.findUnique({ where: { id: +dto.categoryId } }),
      this.prisma.specialization.findUnique({
        where: { id: +dto.specializationId },
      }),
    ]);

    if (!category) throw new NotFoundException('Category not found');
    if (!specialization)
      throw new NotFoundException('Specialization not found');

    const tempFileName = `temp_${Date.now()}.json`;
    const { path, size, hash } = await this.storageService.saveContent(
      tempFileName,
      parsedContent,
      'projects',
    );

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
          contentPath: path,
          contentSize: size,
          contentHash: hash,
        },
      });

      const newFileName = `project_${project.id}.json`;
      await this.storageService.renameFile(path, newFileName, 'projects');

      return this.prisma.project.update({
        where: { id: project.id },
        data: { contentPath: newFileName },
        include: { user: true, category: true, specialization: true },
      });
    } catch (error) {
      await this.storageService
        .deleteFile(path, 'projects')
        .catch(console.error);
      throw error;
    }
  }

  async updateProject(
    projectId: number,
    dto: UpdateProjectDto,
    userId: number,
    coverImage?: Express.Multer.File,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        userId: true,
        photoName: true,
        contentPath: true,
        contentHash: true,
        contentSize: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this project',
      );
    }

    let parsedContent;
    if (dto.content) {
      try {
        parsedContent =
          typeof dto.content === 'string'
            ? JSON.parse(dto.content)
            : dto.content;

        if (!Array.isArray(parsedContent)) {
          throw new Error('Content must be an array');
        }

        this.analyzeSlateStructure(parsedContent);
        this.validateSlateContent(parsedContent);
      } catch (error) {
        throw new BadRequestException(
          `Invalid content format: ${error.message}`,
        );
      }
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: +dto.categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
    }

    if (dto.specializationId) {
      const specialization = await this.prisma.specialization.findUnique({
        where: { id: +dto.specializationId },
      });
      if (!specialization)
        throw new NotFoundException('Specialization not found');
    }

    let newContentPath = project.contentPath;
    let newContentSize = project.contentSize;
    let newContentHash = project.contentHash;

    if (parsedContent) {
      const tempFileName = `temp_${Date.now()}.json`;
      const { path, size, hash } = await this.storageService.saveContent(
        tempFileName,
        parsedContent,
        'projects',
      );

      const newFileName = `project_${projectId}.json`;
      await this.storageService.renameFile(path, newFileName, 'projects');

      if (project.contentPath) {
        await this.storageService
          .deleteFile(project.contentPath, 'projects')
          .catch(console.error);
      }

      newContentPath = newFileName;
      newContentSize = size;
      newContentHash = hash;
    }

    let newPhotoName = project.photoName;
    if (coverImage) {
      if (project.photoName) {
        await this.storageService
          .deleteFile(project.photoName, 'projects')
          .catch(console.error);
      }
      newPhotoName = coverImage.filename;
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        name: dto.name,
        description: dto.description || null,
        categoryId: dto.categoryId ? +dto.categoryId : undefined,
        specializationId: dto.specializationId
          ? +dto.specializationId
          : undefined,
        firstLink: dto.firstLink || null,
        secondLink: dto.secondLink || null,
        photoName: newPhotoName,
        contentPath: newContentPath,
        contentSize: newContentSize,
        contentHash: newContentHash,
      },
      include: { user: true, category: true, specialization: true },
    });
  }

  async deleteProject(projectId: number, userId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        userId: true,
        photoName: true,
        contentPath: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this project',
      );
    }

    if (project.photoName) {
      await this.storageService
        .deleteFile(project.photoName, 'projects')
        .catch(console.error);
    }

    if (project.contentPath) {
      await this.storageService
        .deleteFile(project.contentPath, 'projects')
        .catch(console.error);
    }

    return this.prisma.project.delete({
      where: { id: projectId },
    });
  }

  private analyzeSlateStructure(content: any[]): void {
    console.log('=== SLATE STRUCTURE ANALYSIS ===');

    const countNodes = (
      nodes: any[],
      level = 0,
    ): { elements: number; texts: number } => {
      let elements = 0;
      let texts = 0;

      for (const node of nodes) {
        if (node.text !== undefined) {
          texts++;
          console.log(
            `${'  '.repeat(level)}Text: "${node.text}"`,
            node.bold ? 'BOLD' : '',
            node.italic ? 'ITALIC' : '',
            node.color ? `Color: ${node.color}` : '',
          );
        } else if (node.type) {
          elements++;
          console.log(`${'  '.repeat(level)}Element: ${node.type}`);
          if (node.children && Array.isArray(node.children)) {
            const childCount = countNodes(node.children, level + 1);
            elements += childCount.elements;
            texts += childCount.texts;
          }
        }
      }

      return { elements, texts };
    };

    const counts = countNodes(content);
    console.log(
      `Total elements: ${counts.elements}, Text nodes: ${counts.texts}`,
    );
    console.log('=== END ANALYSIS ===');
  }

  private validateSlateContent(content: any[]): void {
    if (!content || !Array.isArray(content)) {
      throw new Error('Content must be a non-empty array');
    }

    for (const node of content) {
      this.validateSlateNode(node);
    }
  }

  private validateSlateNode(node: any): void {
    if (!node || typeof node !== 'object') {
      throw new Error('Node must be an object');
    }

    if (node.text !== undefined) {
      if (typeof node.text !== 'string') {
        throw new Error('Text node must have string text property');
      }
      return;
    }

    if (!node.type || typeof node.type !== 'string') {
      throw new Error('Element node must have a string type property');
    }

    if (!node.children || !Array.isArray(node.children)) {
      throw new Error('Element node must have children array');
    }

    for (const child of node.children) {
      this.validateSlateNode(child);
    }
  }

  async getPopularProjects() {
    try {
      const allProjects = await this.prisma.project.findMany({
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

      const sortedProjects = allProjects.sort((a, b) => {
        const aPopularity = a._count.likedBy + a._count.viewedBy;
        const bPopularity = b._count.likedBy + b._count.viewedBy;
        return bPopularity - aPopularity;
      });

      const topProjects = sortedProjects.slice(0, 4);

      return topProjects.map((project) => this.mapToProjectResponse(project));
    } catch (error) {
      throw new Error(`Failed to get popular projects: ${error.message}`);
    }
  }

  async getProjectWithContent(
    projectId: number,
    req: Request & { user?: { sub: number } },
  ) {
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
      },
    });

    if (!project) {
      throw new NotFoundException('Проект с таким id не найден');
    }

    const content = project.contentPath
      ? await this.storageService.loadContent(project.contentPath, 'projects')
      : null;

    const anotherProjects = await this.getUserProjects(project.user.id);
    console.log('Current user sub:', req.user?.sub);
    console.log(
      'LikedBy users:',
      project.likedBy.map((u) => u.id),
    );

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
    try {
      const projects = await this.prisma.project.findMany({
        take: 8,
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
      throw new Error(`Failed to get projects: ${error.message}`);
    }
  }

  async getAllProjects() {
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
        subscription: project.user.subscription.name,
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
