import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(
    createProjectDto: CreateProjectDto,
    userId: number,
    coverImage?: Express.Multer.File,
  ) {
    const {
      name,
      description,
      categoryId,
      specializationId,
      content,
      firstLink,
      secondLink,
    } = createProjectDto;

    await this.validateRelations(userId, categoryId, specializationId);

    return this.prisma.project.create({
      data: {
        name,
        description,
        photoName: coverImage?.filename,
        categoryId,
        specializationId,
        userId,
        firstLink,
        secondLink,
        content: content ? JSON.parse(JSON.stringify(content)) : null,
      },
      include: {
        user: true,
        category: true,
        specialization: true,
      },
    });
  }

  private async validateRelations(
    userId: number,
    categoryId: number,
    specializationId?: number,
  ) {
    // Проверка пользователя
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Проверка категории
    const categoryExists = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Проверка специализации (если указана)
    if (specializationId) {
      const specializationExists = await this.prisma.specialization.findUnique({
        where: { id: specializationId },
      });
      if (!specializationExists) {
        throw new NotFoundException(
          `Specialization with ID ${specializationId} not found`,
        );
      }
    }
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

  private async validateUserAndCategory(
    userId: number,
    categoryId: number,
  ): Promise<void> {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const categoryExists = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
  }

  private mapToProjectResponse(project: any) {
    return {
      id: project.id,
      name: project.name,
      coverImage: project.photoName,
      content: project.content,
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
}
