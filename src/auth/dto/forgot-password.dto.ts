import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordRequest {
  @IsEmail({}, { message: 'Неккоректный формат почты' })
  @IsString({ message: 'Почта должна быть строкой' })
  @IsNotEmpty({ message: 'Почта обязательна для заполнения' })
  @ApiProperty({
    description: 'email',
    example: 'vitaly.sadikov1@yandex.ru',
  })
  email: string;
}
