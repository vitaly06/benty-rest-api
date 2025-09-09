import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateBlogDto {
  @ApiProperty({
    description: 'Название блога',
    example: 'Обновленная тестовая статья',
    required: false,
  })
  @IsString({ message: 'Название блога должно быть строкой' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'ID специализации',
    example: 1,
    type: Number,
    required: false,
  })
  @Type(() => Number)
  @IsInt({ message: 'ID специализации должен быть целым числом' })
  @IsPositive({ message: 'ID специализации должен быть положительным числом' })
  @IsNumber({}, { message: 'ID специализации должен быть числом' })
  @IsOptional()
  specializationId?: number;

  @ApiProperty({
    description: 'Контент блога (Slate.js JSON)',
    example: '[{"type":"paragraph","children":[{"text":"Обновленный контент"}]}]',
    required: false,
  })
  @IsOptional()
  content?: string | any[];
}