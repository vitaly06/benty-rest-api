import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { ProjectService } from './project.service';
import { CreateProjectRequest } from './dto/create-project.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

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
}
