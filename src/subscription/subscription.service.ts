import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.subscription.findMany({
      select: { id: true, name: true },
    });
  }
}
