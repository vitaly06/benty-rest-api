import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'name',
    example: 'Дизайн для мобильного приложения',
  })
  @IsString({ message: 'Название проекта должно быть строкой' })
  @IsNotEmpty({ message: 'Название проекта обязательно для заполнения' })
  name: string;

  @ApiProperty({
    required: false,
    description: 'description',
    example: 'Описание для проекта',
  })
  @IsString({ message: 'Описание проекта должно быть строкой' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'specializationId',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'Id специализации должен быть целым числом' })
  @IsPositive({ message: 'Id специализации должен быть положительным числом' })
  @IsNumber({}, { message: 'Id специализации должен быть числом' })
  specializationId: number;

  @ApiProperty({
    description: 'categoryId',
    example: 3,
    type: Number,
  })
  @IsInt({ message: 'Id категории должен быть целым числом' })
  @IsPositive({ message: 'Id категории должен быть положительным числом' })
  @IsNumber({}, { message: 'Id категории должен быть числом' })
  categoryId: number;

  @ApiProperty({ type: Object })
  @IsArray()
  content: any[]; // Slate.js content as array

  @ApiProperty({
    description: 'firstLink',
    example: 'figma.com/my-project',
    required: false,
  })
  @IsString({ message: 'Первая ссылка на проект должна быть строкой' })
  @IsOptional()
  firstLink?: string;

  @ApiProperty({
    description: 'secondLink',
    example: 'figma.com/my-second-project',
    required: false,
  })
  @IsString({ message: 'Вторая ссылка на проект должна быть строкой' })
  @IsOptional()
  secondLink?: string;
}
