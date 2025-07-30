import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProjectRequest {
  @IsString({ message: 'Название проекта должно быть строкой' })
  @IsNotEmpty({ message: 'Название проекта обязательно для заполнения' })
  name: string;
  @Type(() => Number)
  @IsNumber({}, { message: 'userId должен быть числом' })
  @IsInt({ message: 'userId должен быть целым числом' })
  @IsPositive({ message: 'userId должен быть положительным числом' })
  userId: number;
  @Type(() => Number)
  @IsNumber({}, { message: 'categoryId должен быть числом' })
  @IsInt({ message: 'categoryId должен быть целым числом' })
  @IsPositive({ message: 'categoryId должен быть положительным числом' })
  categoryId: number;
}
