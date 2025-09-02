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

    // ДЕБАГ: Проверяем, что приходит в content
    console.log('dto.content type:', typeof dto.content);
    console.log('dto.content value:', dto.content);

    // Проверяем, что content не null/undefined и не строка "null"
    if (!dto.content || dto.content === 'null' || dto.content === 'undefined') {
      throw new NotFoundException('Контент блога не может быть пустым');
    }

    let parsedContent;
    try {
      // Пытаемся распарсить JSON, если это строка
      parsedContent =
        typeof dto.content === 'string' ? JSON.parse(dto.content) : dto.content;
    } catch (error) {
      console.error('Error parsing blog content:', error);
      throw new NotFoundException('Неверный формат контента');
    }

    // 2. Сначала сохраняем контент в файл
    const tempFileName = `temp_${Date.now()}.json`;
    const { path, size, hash } = await this.storageService.saveContent(
      tempFileName,
      parsedContent, // Используем распаршенный контент
      'blogs',
    );

    try {
      // 3. Создаем блог
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

    const blogsWithDescription = await Promise.all(
      blogs.map(async (blog) => {
        try {
          let description = '';

          // Если есть контент, извлекаем текст из него
          if (blog.contentPath) {
            try {
              const content = await this.storageService.loadContent(
                blog.contentPath,
                'blogs',
              );

              // Проверяем, что контент не null
              if (content && content !== 'null') {
                const extractedText = this.extractTextFromContent(content);
                if (extractedText) {
                  description = extractedText.substring(0, 280);
                }
              }
            } catch (error) {
              console.error(
                `Error loading content for blog ${blog.id}:`,
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
          console.error(`Error processing blog ${blog.id}:`, error);
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
          logoFileName: blog.user.logoFileName,
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
  // blog.service.ts
  private extractTextFromContent(content: any): string {
    if (!content || !Array.isArray(content)) return '';

    let text = '';
    let isFirstTitle = true; // Флаг для пропуска первого заголовка

    // Рекурсивная функция для обхода структуры Slate.js
    const traverseNodes = (nodes: any[]) => {
      for (const node of nodes) {
        // Пропускаем первый заголовок (где "Здесь может быть заголовок")
        if (node.type === 'title' && isFirstTitle) {
          isFirstTitle = false;
          continue; // Пропускаем первый заголовок
        }

        if (node.text) {
          // Добавляем только чистый текст без стилей
          text += node.text + ' ';
        } else if (node.children && Array.isArray(node.children)) {
          traverseNodes(node.children);
        }

        // Добавляем переносы строк для абзацев и заголовков (кроме пропущенного первого)
        if (
          (node.type === 'paragraph' || node.type === 'heading') &&
          !(node.type === 'title' && isFirstTitle)
        ) {
          text += '\n\n';
        }
      }
    };

    traverseNodes(content);

    // Очищаем текст от лишних пробелов и переносов
    return text
      .replace(/\s+/g, ' ') // Заменяем множественные пробелы на один
      .replace(/\n\s*\n/g, '\n\n') // Очищаем переносы строк
      .trim();
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
