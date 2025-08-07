import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Express, Request } from 'express';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectResponseDto } from './dto/project-response.dto';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional.guard';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({
    summary: 'Create a new project',
    description: 'Creates a new project with content and optional cover image',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Project successfully created',
    type: ProjectResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Project data with cover image',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Дизайн для мобильного приложения',
          description: 'Project name',
        },
        description: {
          type: 'string',
          example: 'Описание проекта',
          description: 'Project description',
        },
        specializationId: {
          type: 'number',
          example: 1,
          description: 'Specialization ID',
        },
        categoryId: {
          type: 'number',
          example: 3,
          description: 'Category ID',
        },
        content: {
          type: 'string',
          description: 'JSON stringified array of Slate.js content',
          example:
            '[{"type":"paragraph","children":[{"text":"Project content"}]}]',
        },
        firstLink: {
          type: 'string',
          example: 'figma.com/my-project',
          description: 'First project link',
        },
        secondLink: {
          type: 'string',
          example: 'figma.com/my-second-project',
          description: 'Second project link',
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
  @Post('create-projects')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('coverImage'))
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: RequestWithUser,
    @UploadedFile() coverImage?: Express.Multer.File,
  ) {
    return this.projectService.createProject(
      createProjectDto,
      req.user.sub,
      coverImage,
    );
  }

  @ApiOperation({
    summary: 'Get projects for main page',
    description: 'Returns projects for display on the main page',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of projects',
    type: [ProjectResponseDto],
  })
  @Get('main')
  async getProjectsForMainPage() {
    return this.projectService.getProjectsForMainPage();
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('project-by-id/:projectId')
  async getProjectById(
    @Param('projectId') projectId: string,
    @Req() req: Request & { user?: { sub: number } },
  ) {
    return await this.projectService.getProjectWithContent(+projectId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('like-project/:projectId')
  async likeProject(
    @Param('projectId') projectId: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.projectService.likeProject(+projectId, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unlike-project/:projectId')
  async unlikeProject(
    @Param('projectId') projectId: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.projectService.unlikeProject(+projectId, req.user.sub);
  }
}
