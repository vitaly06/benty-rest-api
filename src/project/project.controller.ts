import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express, Response } from 'express';
import { ProjectService } from './project.service';
import { CreateProjectRequest } from './dto/create-project.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProduces,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'userId', 'categoryId'],
      properties: {
        name: { type: 'string' },
        userId: { type: 'number' },
        categoryId: { type: 'number' },
        photo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Создание проекта',
  })
  @ApiConsumes('multipart/form-data')
  @Post('create-project')
  @UseInterceptors(FileInterceptor('photo'))
  async createProject(
    @Body() dto: CreateProjectRequest,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return await this.projectService.createProject(dto, photo.filename);
  }

  @Get('projects-to-main-page')
  async getProjects() {
    return await this.projectService.getProjectsToMainPage();
  }

  @ApiOperation({
    summary: 'Получение фото проекта',
  })
  @ApiParam({ name: 'filename', description: 'Имя файла', type: String })
  @ApiProduces('image/*')
  @Get('photo/:filename')
  async getPhoto(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const file = createReadStream(
      join(process.cwd(), 'uploads', 'projects', filename),
    );
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `inline; filename="${filename}"`,
    });

    return new StreamableFile(file);
  }
}
