import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordRequest {
  @ApiProperty({
    description: 'currentPassword',
    example: '1234567',
  })
  @IsString({ message: 'Текущий пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Текущий пароль обязателен для заполнения' })
  currentPassword: string;
  @ApiProperty({
    description: 'newPassword',
    example: '123456',
  })
  @IsString({ message: 'Новый пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Новый пароль обязателен для заполнения' })
  newPassword: string;
  @ApiProperty({
    description: 'newRepassword',
    example: '123456',
  })
  @IsString({ message: 'Повтор пароля должен быть строкой' })
  @IsNotEmpty({ message: 'Повтор пароля обязателен для заполнения' })
  newRepassword: string;
}
