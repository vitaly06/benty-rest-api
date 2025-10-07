import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class signUpRequest {
  @ApiProperty({
    description: 'login',
    example: 'vitaly.sadikov',
  })
  @IsString({ message: 'Логин должен быть строкой' })
  @IsNotEmpty({ message: 'Логин обязателен для заполнения' })
  @Length(5, 20, {
    message: 'Длина логина должна быть не менее 5 символов и не более 20',
  })
  login: string;
  @IsEmail({}, { message: 'Неккоректный формат почты' })
  @IsString({ message: 'Почта должна быть строкой' })
  @IsNotEmpty({ message: 'Почта обязательна для заполнения' })
  @ApiProperty({
    description: 'email',
    example: 'vitaly.sadikov1@yandex.ru',
  })
  email: string;
  @IsString({ message: 'Пароль должен строкой' })
  @MinLength(6, { message: 'Минимальная длина пароля - 6 символов' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  @ApiProperty({
    description: 'password',
    example: '123456',
  })
  password: string;
  @ApiProperty({
    description: 'password',
    example: '123456',
  })
  @MinLength(6, { message: 'Минимальная длина пароля - 6 символов' })
  @IsNotEmpty({ message: 'Повтор пароля обязателен для заполнения' })
  repassword: string;

  @IsString({ message: 'Промокод должен быть строкой' })
  @IsOptional()
  @ApiProperty({
    description: 'promocode',
    example: 'PROMO123',
    required: false,
  })
  promocode?: string;
}
