import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeLoginRequest {
  @ApiProperty({
    description: 'login',
    example: 'testLogin',
  })
  @IsString({ message: 'Логин должен быть строкой' })
  @IsNotEmpty({
    message: 'Логин обязателен для заполнения',
  })
  login: string;
}
