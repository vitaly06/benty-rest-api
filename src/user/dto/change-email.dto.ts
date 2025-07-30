import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangeEmailRequest {
  @ApiProperty({
    description: 'email',
    example: 'egorskomorohov020606@gmail.com',
  })
  @IsString({ message: 'Почта должна быть строкой' })
  @IsEmail({}, { message: 'Неверный формат почты' })
  @IsNotEmpty({ message: 'Почта обязательна для заполнения' })
  email: string;
}
