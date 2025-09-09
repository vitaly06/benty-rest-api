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

export class UpdateProjectDto {
  @ApiProperty({
    description: 'name',
    example: 'Updated Дизайн для мобильного приложения',
    required: false,
  })
  @IsString({ message: 'Название проекта должно быть строкой' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'description',
    example: 'Updated description',
    required: false,
  })
  @IsString({ message: 'Описание проекта должно быть строкой' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'specializationId',
    example: 1,
    type: Number,
    required: false,
  })
  @Type(() => Number)
  @IsInt({ message: 'Id специализации должен быть целым числом' })
  @IsPositive({ message: 'Id специализации должен быть положительным числом' })
  @IsNumber({}, { message: 'Id специализации должен быть числом' })
  @IsOptional()
  specializationId?: number;

  @ApiProperty({
    description: 'categoryId',
    example: 3,
    type: Number,
    required: false,
  })
  @Type(() => Number)
  @IsInt({ message: 'Id категории должен быть целым числом' })
  @IsPositive({ message: 'Id категории должен быть положительным числом' })
  @IsNumber({}, { message: 'Id категории должен быть числом' })
  @IsOptional()
  categoryId?: number;

  @ApiProperty({
    description: 'firstLink',
    example: 'figma.com/my-updated-project',
    required: false,
  })
  @IsString({ message: 'Первая ссылка на проект должна быть строкой' })
  @IsOptional()
  firstLink?: string;

  @ApiProperty({
    description: 'secondLink',
    example: 'figma.com/my-updated-second-project',
    required: false,
  })
  @IsString({ message: 'Вторая ссылка на проект должна быть строкой' })
  @IsOptional()
  secondLink?: string;

  @ApiProperty({
    description: 'Project content (Slate.js JSON)',
    example: '[{"type":"paragraph","children":[{"text":"Updated content"}]}]',
    required: false,
  })
  @IsOptional()
  content?: string | any[];
}