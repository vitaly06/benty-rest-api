import { Controller, Get } from '@nestjs/common';
import { SpecializationService } from './specialization.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('specialization')
export class SpecializationController {
  constructor(private readonly specializationService: SpecializationService) {}

  @ApiOperation({
    summary: 'Получение всех специализаций',
  })
  @Get('find-all')
  async findAll() {
    return await this.specializationService.findAll();
  }
}
