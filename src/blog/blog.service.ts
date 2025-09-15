import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { StorageService } from 'src/storage/storage.service';
import { Request } from 'express';
import { Blog } from '@prisma/client';

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

    console.log('dto.content type:', typeof dto.content);
    console.log('dto.content value:', dto.content);

    if (!dto.content || dto.content === 'null' || dto.content === 'undefined') {
      throw new BadRequestException('Контент блога не может быть пустым');
    }

    let parsedContent;
    try {
      parsedContent =
        typeof dto.content === 'string' ? JSON.parse(dto.content) : dto.content;
      if (!Array.isArray(parsedContent)) {
        throw new Error('Контент должен быть массивом');
      }
    } catch (error) {
      console.error('Ошибка при парсинге контента блога:', error);
      throw new BadRequestException('Неверный формат контента');
    }

    const tempFileName = `temp_${Date.now()}.json`;
    const { path, size, hash } = await this.storageService.saveContent(
      tempFileName,
      parsedContent,
      'blogs',
    );

    try {
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

  async updateBlog(
    blogId: number,
    dto: UpdateBlogDto,
    userId: number,
    coverImage?: Express.Multer.File,
  ) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        userId: true,
        photoName: true,
        contentPath: true,
        contentHash: true,
        contentSize: true,
      },
    });

    if (!blog) {
      throw new NotFoundException('Блог с таким ID не найден');
    }

    if (blog.userId !== userId) {
      throw new ForbiddenException(
        'Вы не авторизованы для обновления этого блога',
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
          throw new Error('Контент должен быть массивом');
        }
      } catch (error) {
        throw new BadRequestException(
          `Неверный формат контента: ${error.message}`,
        );
      }
    }

    if (dto.specializationId) {
      const specialization = await this.prisma.specialization.findUnique({
        where: { id: +dto.specializationId },
      });
      if (!specialization)
        throw new NotFoundException('Специализация не найдена');
    }

    let newContentPath = blog.contentPath;
    let newContentSize = blog.contentSize;
    let newContentHash = blog.contentHash;

    if (parsedContent) {
      const tempFileName = `temp_${Date.now()}.json`;
      const { path, size, hash } = await this.storageService.saveContent(
        tempFileName,
        parsedContent,
        'blogs',
      );

      const newFileName = `blog_${blogId}.json`;
      await this.storageService.renameFile(path, newFileName, 'blogs');

      if (blog.contentPath) {
        await this.storageService
          .deleteFile(blog.contentPath, 'blogs')
          .catch(console.error);
      }

      newContentPath = newFileName;
      newContentSize = size;
      newContentHash = hash;
    }

    let newPhotoName = blog.photoName;
    if (coverImage) {
      if (blog.photoName) {
        await this.storageService
          .deleteFile(blog.photoName, 'blogs')
          .catch(console.error);
      }
      newPhotoName = coverImage.filename;
    }

    return this.prisma.blog.update({
      where: { id: blogId },
      data: {
        name: dto.name,
        specializationId: dto.specializationId
          ? +dto.specializationId
          : undefined,
        photoName: newPhotoName,
        contentPath: newContentPath,
        contentSize: newContentSize,
        contentHash: newContentHash,
      },
      include: { user: true, specialization: true },
    });
  }

  async deleteBlog(blogId: number, userId: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        userId: true,
        photoName: true,
        contentPath: true,
      },
    });

    if (!blog) {
      throw new NotFoundException('Блог с таким ID не найден');
    }

    if (blog.userId !== userId) {
      throw new ForbiddenException(
        'Вы не авторизованы для удаления этого блога',
      );
    }

    if (blog.photoName) {
      await this.storageService
        .deleteFile(blog.photoName, 'blogs')
        .catch(console.error);
    }

    if (blog.contentPath) {
      await this.storageService
        .deleteFile(blog.contentPath, 'blogs')
        .catch(console.error);
    }

    return this.prisma.blog.delete({
      where: { id: blogId },
    });
  }

  // Страница со всеми блогами
  async getAllBlogs() {
    const blogs = await this.prisma.blog.findMany({
      include: {
        user: {
          include: {
            specializations: true,
          },
        },
        likedBy: {
          select: {
            id: true,
          },
        },
        viewedBy: {
          select: {
            id: true,
          },
        },
      },
    });

    return await this.mapToBlogResponse(blogs);
  }

  // Проекты пользователя
  async getUserBlogs(userId: number) {
    const blogs = await this.prisma.blog.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          include: {
            specializations: true,
          },
        },
        likedBy: {
          select: {
            id: true,
          },
        },
        viewedBy: {
          select: {
            id: true,
          },
        },
      },
    });

    return await this.mapToBlogResponse(blogs);
  }

  async mapToBlogResponse(blogs: any) {
    const blogsWithDescription = await Promise.all(
      blogs.map(async (blog) => {
        try {
          let description = '';

          if (blog.contentPath) {
            try {
              const content = await this.storageService.loadContent(
                blog.contentPath,
                'blogs',
              );

              if (content && content !== 'null') {
                const extractedText = this.extractTextFromContent(content);
                if (extractedText) {
                  description = extractedText.substring(0, 280);
                }
              }
            } catch (error) {
              console.error(
                `Ошибка при загрузке контента для блога ${blog.id}:`,
                error,
              );
            }
          }

          return {
            id: blog.id,
            name: blog.name,
            coverImage: blog.photoName,
            contentPath: blog.contentPath,
            author: {
              id: blog.user.id,
              name: blog.user.fullName,
              avatar: blog.user.logoFileName,
              specializations: blog.user.specializations,
            },
            specializationId: blog.specializationId,
            likes: blog.likedBy.length,
            views: blog.viewedBy.length,
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt,
            description,
          };
        } catch (error) {
          console.error(`Ошибка при обработке блога ${blog.id}:`, error);
          return {
            id: blog.id,
            name: blog.name,
            coverImage: blog.photoName,
            author: {
              id: blog.user.id,
              name: blog.user.fullName,
            },
            createdAt: blog.createdAt,
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
      throw new NotFoundException('Блог с таким ID не найден');
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
    }

    const content = blog.contentPath
      ? await this.storageService.loadContent(blog.contentPath, 'blogs')
      : null;

    const result = {
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
        logoFileName: blog.user.logoFileName,
        city: blog.user.city,
      },
      views: blog.viewedBy.length,
      likedBy:
        blog.likedBy.length > 5 ? blog.likedBy.slice(0, 5) : blog.likedBy,
      isLiked: req.user
        ? blog.likedBy.some((user) => String(user.id) === String(req.user.sub))
        : false,
      content,
    };

    return result;
  }

  async likeBlog(blogId: number, userId: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });
    if (!blog) {
      throw new NotFoundException('Данного блога не существует');
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
      throw new NotFoundException('Данного блога не существует');
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
    let isFirstTitle = true;

    const traverseNodes = (nodes: any[]) => {
      for (const node of nodes) {
        if (node.type === 'title' && isFirstTitle) {
          isFirstTitle = false;
          continue;
        }

        if (node.text) {
          text += node.text + ' ';
        } else if (node.children && Array.isArray(node.children)) {
          traverseNodes(node.children);
        }

        if (
          (node.type === 'paragraph' || node.type === 'heading') &&
          !(node.type === 'title' && isFirstTitle)
        ) {
          text += '\n\n';
        }
      }
    };

    traverseNodes(content);

    return text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  }

  async formatDate(date: Date) {
    const pad = (num) => String(num).padStart(2, '0');

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${pad(day)}.${pad(month)}.${year}`;
  }
}
