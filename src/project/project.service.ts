import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectRequest } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(dto: CreateProjectRequest, photoName: string) {
    const { name, userId, categoryId } = { ...dto };
    return await this.prisma.project.create({
      data: {
        name,
        userId: +userId,
        categoryId: +categoryId,
        photoName,
      },
    });
  }

  async getProjectsToMainPage() {
    const result = [];

    const projects = await this.prisma.project.findMany({
      take: 8,
      select: {
        id: true,
        name: true,
        photoName: true,
        user: {
          select: {
            logoFileName: true,
            fullName: true,
            specialization: {
              select: {
                name: true,
              },
            },
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    for (const project of projects) {
      result.push({
        id: project.id,
        name: project.name,
        projectPhotoName: project.photoName,
        userLogoPhotoName: project.user.logoFileName,
        fullName: project.user.fullName,
        specialization: project.user.specialization.name,
        category: project.category.name,
      });
    }

    return result;
  }
}
