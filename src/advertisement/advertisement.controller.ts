import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdvertisementService } from './advertisement.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { createAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdvertisementType } from './enum/advertisement.enum';

@ApiTags('Advertisements(объявленния о работе и вакансиях)')
@Controller('advertisement')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}

  @ApiOperation({
    summary: 'Создание работы/вакансии',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Создание объявления о работе/вакансии с загрузкой файла',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Файл изображения для объявления',
        },
        type: {
          type: 'string',
          enum: Object.values(AdvertisementType),
          description: 'Тип объявления',
          example: AdvertisementType.VACANCY,
        },
        name: {
          type: 'string',
          description: 'Название вакансии',
          example: 'Frontend Developer',
        },
        companyName: {
          type: 'string',
          description: 'Название компании',
          example: 'IT Solutions Ltd',
        },
        employmentType: {
          type: 'string',
          description: 'Тип трудоустройства',
          example: 'Полная занятость',
        },
        jobFormat: {
          type: 'string',
          description: 'Формат работы',
          example: 'Удаленно',
        },
        whatToDo: {
          type: 'string',
          description: 'Что нужно делать',
          example: 'Разрабатывать веб-приложения на React',
        },
        expectations: {
          type: 'string',
          description: 'Ожидания от кандидата',
          example: 'Опыт работы с React от 2 лет',
        },
        weOffer: {
          type: 'string',
          description: 'Что предлагаем',
          example: 'Гибкий график, ДМС, обучение',
        },
        minWage: {
          type: 'number',
          description: 'Минимальная зарплата',
          example: 80000,
        },
        maxWage: {
          type: 'number',
          description: 'Максимальная зарплата',
          example: 150000,
        },
        currency: {
          type: 'string',
          description: 'Валюта',
          example: 'RUB',
        },
        telegram: {
          type: 'string',
          description: 'Telegram контакт',
          example: '@company_hr',
        },
        vk: {
          type: 'string',
          description: 'VK контакт',
          example: 'vk.com/company',
        },
        email: {
          type: 'string',
          description: 'Email для связи',
          example: 'hr@company.com',
        },
      },
      required: [
        'file',
        'type',
        'name',
        'companyName',
        'employmentType',
        'jobFormat',
        'whatToDo',
        'expectations',
        'weOffer',
        'minWage',
        'maxWage',
        'currency',
      ],
    },
  })
  @Post('create-advertisement')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createAdvertisement(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: createAdvertisementDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.advertisementService.createAdvertisement(
      dto,
      file.filename,
      req.user.sub,
    );
  }

  @ApiOperation({
    summary: 'Список всех объявлений',
  })
  @Get('all-jobs')
  async getAllJobs() {
    return await this.advertisementService.findAll();
  }

  @ApiOperation({
    summary: 'Список моих объявлений',
  })
  @UseGuards(JwtAuthGuard)
  @Get('get-my-jobs')
  async getMyJobs(@Req() req: RequestWithUser) {
    return await this.advertisementService.getMyJobs(req.user.sub);
  }

  @ApiOperation({
    summary: 'Получения объявления по id',
  })
  @Get('get-advertisement/:id')
  async getAdvertisementById(@Param('id') id: string) {
    return await this.advertisementService.getAdvertisementById(+id);
  }

  @ApiOperation({
    summary: 'Обновление объявления',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Обновление объявления с возможностью загрузки нового файла',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Новый файл изображения (необязательно)',
        },
        type: {
          type: 'string',
          enum: Object.values(AdvertisementType),
          description: 'Тип объявления',
        },
        name: {
          type: 'string',
          description: 'Название вакансии',
        },
        companyName: {
          type: 'string',
          description: 'Название компании',
        },
        employmentType: {
          type: 'string',
          description: 'Тип трудоустройства',
        },
        jobFormat: {
          type: 'string',
          description: 'Формат работы',
        },
        whatToDo: {
          type: 'string',
          description: 'Что нужно делать',
        },
        expectations: {
          type: 'string',
          description: 'Ожидания от кандидата',
        },
        weOffer: {
          type: 'string',
          description: 'Что предлагаем',
        },
        minWage: {
          type: 'number',
          description: 'Минимальная зарплата',
        },
        maxWage: {
          type: 'number',
          description: 'Максимальная зарплата',
        },
        currency: {
          type: 'string',
          description: 'Валюта',
        },
        telegram: {
          type: 'string',
          description: 'Telegram контакт',
        },
        vk: {
          type: 'string',
          description: 'VK контакт',
        },
        email: {
          type: 'string',
          description: 'Email для связи',
        },
      },
    },
  })
  @Patch('update-advertisement/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateAdvertisement(
    @Param('id') id: string,
    @Body() dto: UpdateAdvertisementDto,
    @Req() req: RequestWithUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.advertisementService.updateAdvertisement(
      +id,
      dto,
      req.user.sub,
      file?.filename,
    );
  }
}
