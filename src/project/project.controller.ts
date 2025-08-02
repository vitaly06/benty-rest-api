import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Req,
} from '@nestjs/common';
import { Express } from 'express';
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
    description: 'Project creation data',
    type: CreateProjectDto,
  })
  @Post('create-projects')
  @UseInterceptors(FileInterceptor('coverImage'))
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: RequestWithUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
        fileIsRequired: false,
      }),
    )
    coverImage?: Express.Multer.File,
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
}
