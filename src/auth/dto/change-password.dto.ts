import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class ChangePasswordRequest {
  @ApiProperty({
    description: 'userId',
    type: Number,
    example: 1,
  })
  @IsNumber({}, { message: 'userId должен быть числом' })
  @IsPositive({ message: 'userId должен быть положительным числом' })
  @IsInt({ message: 'userId должен быть целым числом' })
  userId: number;
  @ApiProperty({
    description: 'password',
    example: '123456',
  })
  @IsString({ message: 'Пароль должен строкой' })
  @MinLength(6, { message: 'Минимальная длина пароля - 6 символов' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  password: string;
}
