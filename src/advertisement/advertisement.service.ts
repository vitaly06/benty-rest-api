import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';

@Injectable()
export class AdvertisementService {
  types = {
    VACANCY: 'Вакансия',
    ORDER: 'Заказ',
  };
  constructor(private readonly prisma: PrismaService) {}

  async createAdvertisement(
    dto: createAdvertisementDto,
    filename: string,
    userId: number,
  ) {
    const advertisement = await this.prisma.advertisement.create({
      data: {
        ...dto,
        maxWage: +dto.maxWage,
        minWage: +dto.minWage,
        photoName: filename,
        userId: userId,
      },
    });

    return advertisement;
  }

  async findAll() {
    const jobs = await this.prisma.advertisement.findMany({
      select: {
        id: true,
        type: true,
        name: true,
        minWage: true,
        jobFormat: true,
        photoName: true,
        companyName: true,
      },
    });

    return jobs.map((job) => {
      return {
        ...job,
        type: this.types[job.type],
      };
    });
  }

  async getMyJobs(userId: number) {
    const jobs = await this.prisma.advertisement.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        type: true,
        name: true,
        minWage: true,
        jobFormat: true,
        photoName: true,
        companyName: true,
      },
    });

    return jobs.map((job) => {
      return {
        ...job,
        type: this.types[job.type],
      };
    });
  }

  async getAdvertisementById(id: number) {
    const jobs = await this.prisma.advertisement.findMany({
      where: { id },
    });

    return jobs;
  }

  async updateAdvertisement(
    id: number,
    dto: UpdateAdvertisementDto,
    userId: number,
    filename?: string,
  ) {
    // Проверяем существование объявления
    const existingAdvertisement = await this.prisma.advertisement.findUnique({
      where: { id },
    });

    if (!existingAdvertisement) {
      throw new NotFoundException('Объявление не найдено');
    }

    // Проверяем права доступа
    if (existingAdvertisement.userId !== userId) {
      throw new ForbiddenException(
        'Нет прав для редактирования этого объявления',
      );
    }

    // Подготавливаем данные для обновления
    const updateData: any = { ...dto };

    // Преобразуем числовые поля, если они есть
    if (dto?.minWage !== undefined) {
      updateData.minWage = Number(dto.minWage);
    }
    if (dto?.maxWage !== undefined) {
      updateData.maxWage = Number(dto.maxWage);
    }

    // Если загружен новый файл, обновляем photoName
    if (filename) {
      updateData.photoName = filename;
    }

    console.log(updateData);

    const updatedAdvertisement = await this.prisma.advertisement.update({
      where: { id },
      data: updateData,
    });

    return updatedAdvertisement;
  }
}
