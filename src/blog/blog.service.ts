import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { StorageService } from 'src/storage/storage.service';
import { Request } from 'express';

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async createBlog(
    dto: CreateBlogDto,
    userId: number,
    coverImage?: Express.Multer.File,
  ) {
    const specialization = await this.prisma.specialization.findUnique({
      where: { id: +dto.specializationId },
    });

    if (!specialization) {
      throw new NotFoundException('Такой специализации не существует');
    }

    // 2. Сначала сохраняем контент в файл (ВНИМАНИЕ: до создания проекта!)
    const tempFileName = `temp_${Date.now()}.json`;
    const { path, size, hash } = await this.storageService.saveContent(
      tempFileName,
      dto.content,
      'blogs',
    );

    try {
      // 3. Создаем блог (БЕЗ передачи content в Prisma)
      const blog = await this.prisma.blog.create({
        data: {
          name: dto.name,
          userId: +userId,
          photoName: coverImage?.filename || null,
          specializationId: +dto.specializationId,
          contentPath: path,
          contentSize: size,
          contentHash: hash,
        },
      });

      // 4. Переименовываем файл с учетом ID проекта
      const newFileName = `blog_${blog.id}.json`;
      await this.storageService.renameFile(path, newFileName, 'blogs');

      return this.prisma.blog.update({
        where: { id: blog.id },
        data: { contentPath: newFileName },
        include: { user: true, specialization: true },
      });
    } catch (error) {
      await this.storageService.deleteFile(path, 'blogs').catch(console.error);
      throw error;
    }
  }

  async getAllBlogs() {
    const blogs = await this.prisma.blog.findMany({
      include: {
        user: {
          include: {
            specializations: true,
          },
        },
      },
    });

    // Обрабатываем каждый блог асинхронно
    const blogsWithDescription = await Promise.all(
      blogs.map(async (blog) => {
        try {
          let description = '';

          // Если есть контент, извлекаем текст из него
          if (blog.contentPath) {
            const content = await this.storageService.loadContent(
              blog.contentPath,
              'blogs',
            );
            description = this.extractTextFromContent(content).substring(
              0,
              280,
            );
          }

          return {
            ...this.mapToBlogResponse(blog),
            description,
          };
        } catch (error) {
          console.error(`Error processing blog ${blog.id}:`, error);
          return {
            ...this.mapToBlogResponse(blog),
            description: '',
          };
        }
      }),
    );

    return blogsWithDescription;
  }

  async getBlogById(
    blogId: number,
    req?: Request & { user?: { sub: number } },
  ) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        id: true,
        name: true,
        photoName: true,
        contentPath: true,
        contentSize: true,
        createdAt: true,
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

    if (!blog) {
      throw new NotFoundException('Блог с таким id не найден');
    }

    if (req.user?.sub) {
      const checkView = await this.prisma.blog.findFirst({
        where: {
          id: blogId,
          viewedBy: {
            some: {
              id: req.user.sub,
            },
          },
        },
      });
      if (!checkView) {
        await this.prisma.blog.update({
          where: { id: blogId },
          data: {
            viewedBy: {
              connect: { id: req.user.sub },
            },
          },
        });
      }

      // Получаем контент
      const content = blog.contentPath
        ? await this.storageService.loadContent(blog.contentPath, 'blogs')
        : null;

      // Форматируем результат
      const result = {
        // ...blog,
        id: blog.id,
        name: blog.name,
        photoName: blog.photoName,
        contentPath: blog.contentPath,
        contentSize: blog.contentSize,
        date: await this.formatDate(blog.createdAt),
        user: {
          id: blog.user.id,
          fullName: blog.user.fullName,
          login: blog.user.login,
          logoFileNmae: blog.user.logoFileName,
          city: blog.user.city,
        },
        views: blog.viewedBy.length,
        likedBy:
          blog.likedBy.length > 5 ? blog.likedBy.slice(0, 5) : blog.likedBy,
        isLiked: req.user
          ? blog.likedBy.some(
              (user) => String(user.id) === String(req.user.sub),
            )
          : false,
        content,
      };

      return result;
    }
  }

  async likeBlog(blogId: number, userId: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });
    if (!blog) {
      throw new NotFoundException('Данного блога не существуте');
    }

    return this.prisma.blog.update({
      where: { id: blogId },
      data: {
        likedBy: {
          connect: { id: userId },
        },
      },
    });
  }

  async unlikeBlog(blogId: number, userId: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });
    if (!blog) {
      throw new NotFoundException('Данного блога не существуте');
    }

    return this.prisma.blog.update({
      where: { id: blogId },
      data: {
        likedBy: {
          disconnect: { id: userId },
        },
      },
    });
  }

  private extractTextFromContent(content: any): string {
    if (!content || !Array.isArray(content)) return '';

    let text = '';

    // Рекурсивная функция для обхода структуры Slate.js
    const traverseNodes = (nodes: any[]) => {
      nodes.forEach((node) => {
        if (node.text) {
          text += node.text + ' ';
        } else if (node.children) {
          traverseNodes(node.children);
        }
      });
    };

    traverseNodes(content);
    return text.trim();
  }

  private mapToBlogResponse(blog: any) {
    return {
      id: blog.id,
      name: blog.name,
      coverImage: blog.photoName,
      contentPath: blog.contentPath,
      author: {
        id: blog.user.id,
        name: blog.user.fullName,
      },
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };
  }

  async formatDate(date: Date) {
    const pad = (num) => String(num).padStart(2, '0');

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${pad(day)}.${pad(month)}.${year}`;
  }
}
