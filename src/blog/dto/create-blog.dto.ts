import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateBlogDto {
  @IsString({ message: 'Название блога должно  быть строкой' })
  @IsNotEmpty({ message: 'Название блога обязательно для заполнения' })
  name: string;
  @IsNotEmpty({ message: 'Id специализации обязателен для заполнения' })
  @IsNumber({}, { message: 'Id специализации должен быть числом' })
  @IsPositive({ message: 'Id специализации должен быть положительныи числом' })
  @IsInt({ message: 'Id специализации должен быть целым числом' })
  @Type(() => Number)
  specializationId: number;
  @ApiProperty({
    description: 'Blog content (Slate.js JSON)',
    example: '[{"type":"paragraph","children":[{"text":"Blog content"}]}]',
    required: true,
  })
  @IsNotEmpty({ message: 'Контент проекта обязателен' })
  content: any;
}
