import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeLoginRequest {
  @IsString({ message: 'Логин должен быть строкой' })
  @IsNotEmpty({
    message: 'Логин обязателен для заполнения',
  })
  login: string;
}
