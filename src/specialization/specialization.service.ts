import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SpecializationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.specialization.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
}
