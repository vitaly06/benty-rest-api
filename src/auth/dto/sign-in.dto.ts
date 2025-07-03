import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class signInRequest {
  @IsEmail({}, { message: 'Неккоректный формат почты' })
  @IsString({ message: 'Почта должна быть строкой' })
  @IsNotEmpty({ message: 'Почта обязательна для заполнения' })
  email: string;
  @IsString({ message: 'Пароль должен строкой' })
  @MinLength(6, { message: 'Минимальная длина пароля - 6 символов' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  password: string;
}
