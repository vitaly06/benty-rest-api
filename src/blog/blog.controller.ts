import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.dto';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional.guard';
import { Request } from 'express';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({
    summary: 'Create a new blog',
    description: 'Creates a new blog with content and optional cover image',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Blog data with cover image',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Тестовая статья',
          description: 'Blog name',
        },
        specializationId: {
          type: 'number',
          example: 1,
          description: 'Specialization ID',
        },
        content: {
          type: 'string',
          description: 'JSON stringified array of Slate.js content',
          example:
            '[{"type":"paragraph","children":[{"text":"Blog content"}]}]',
        },
        coverImage: {
          type: 'string',
          format: 'binary',
          description: 'Project cover image',
        },
      },
      required: ['name', 'specializationId', 'categoryId', 'content'],
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

  @Get('all-blogs')
  async getAllBlogs() {
    return await this.blogService.getAllBlogs();
  }
  @UseGuards(OptionalJwtAuthGuard)
  @Get('blog-by-id/:blogId')
  async getBlogById(
    @Param('blogId') blogId: string,
    @Req() req: Request & { user?: { sub: number } },
  ) {
    return await this.blogService.getBlogById(+blogId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('like-blog/:blogId')
  async likeBlog(@Param('blogId') blogId: string, @Req() req: RequestWithUser) {
    return await this.blogService.likeBlog(+blogId, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unlike-blog/:blogId')
  async unlikeBlog(
    @Param('blogId') blogId: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.blogService.unlikeBlog(+blogId, req.user.sub);
  }
}
