import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.dto';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional.guard';
import { Request } from 'express';

@ApiTags('Blogs')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({
    summary: 'Создать новый блог',
    description:
      'Создает новый блог с контентом и необязательным изображением обложки',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Данные блога с изображением обложки',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Тестовая статья',
          description: 'Название блога',
        },
        specializationId: {
          type: 'number',
          example: 1,
          description: 'ID специализации',
        },
        content: {
          type: 'string',
          description: 'JSON-строка массива контента Slate.js',
          example:
            '[{"type":"paragraph","children":[{"text":"Blog content"}]}]',
        },
        coverImage: {
          type: 'string',
          format: 'binary',
          description: 'Изображение обложки блога',
        },
      },
      required: ['name', 'specializationId', 'content'],
    },
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('coverImage'))
  @Post('create-blog')
  async createBlog(
    @Body() dto: CreateBlogDto,
    @Req() req: RequestWithUser,
    @UploadedFile() coverImage?: Express.Multer.File,
  ) {
    return await this.blogService.createBlog(dto, req.user.sub, coverImage);
  }

  @ApiOperation({
    summary: 'Обновить блог',
    description:
      'Обновляет существующий блог с новым контентом и необязательным изображением обложки',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Блог успешно обновлен',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Данные для обновления блога с необязательным изображением обложки',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Обновленная тестовая статья',
          description: 'Название блога',
        },
        specializationId: {
          type: 'number',
          example: 1,
          description: 'ID специализации',
        },
        content: {
          type: 'string',
          description: 'JSON-строка массива контента Slate.js',
          example:
            '[{"type":"paragraph","children":[{"text":"Обновленный контент"}]}]',
        },
        coverImage: {
          type: 'string',
          format: 'binary',
          description: 'Изображение обложки блога',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('coverImage'))
  @Put('update-blog/:blogId')
  async updateBlog(
    @Param('blogId') blogId: string,
    @Body() dto: UpdateBlogDto,
    @Req() req: RequestWithUser,
    @UploadedFile() coverImage?: Express.Multer.File,
  ) {
    return await this.blogService.updateBlog(
      +blogId,
      dto,
      req.user.sub,
      coverImage,
    );
  }

  @ApiOperation({
    summary: 'Удалить блог',
    description: 'Удаляет блог и связанные с ним файлы',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Блог успешно удален',
  })
  @UseGuards(JwtAuthGuard)
  @Delete('delete-blog/:blogId')
  async deleteBlog(
    @Param('blogId') blogId: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.blogService.deleteBlog(+blogId, req.user.sub);
  }

  @ApiOperation({
    summary: 'Получить все блоги',
  })
  @Get('all-blogs')
  async getAllBlogs() {
    return await this.blogService.getAllBlogs();
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Получить блог по ID',
  })
  @Get('blog-by-id/:blogId')
  async getBlogById(
    @Param('blogId') blogId: string,
    @Req() req: Request & { user?: { sub: number } },
  ) {
    return await this.blogService.getBlogById(+blogId, req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Лайкнуть блог',
  })
  @Post('like-blog/:blogId')
  async likeBlog(@Param('blogId') blogId: string, @Req() req: RequestWithUser) {
    return await this.blogService.likeBlog(+blogId, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Снять лайк с блога',
  })
  @Post('unlike-blog/:blogId')
  async unlikeBlog(
    @Param('blogId') blogId: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.blogService.unlikeBlog(+blogId, req.user.sub);
  }
}
