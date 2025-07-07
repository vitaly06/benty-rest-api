import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class updateMainSettingsRequest {
  @ApiProperty({
    description: 'fullName',
    example: 'Садиков Виталий',
  })
  @IsOptional()
  @IsString({ message: 'fullName должен быть строкой' })
  fullName: string;
  @ApiProperty({
    description: 'city',
    example: 'Оренбург',
  })
  @IsOptional()
  @IsString({ message: 'Город должен быть строкой' })
  city: string;
  @ApiProperty({
    description: 'firstSpecializationId',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'id специализации должен быть числом' })
  @IsInt({ message: 'id специализации должен быть целым числом' })
  @IsPositive({ message: 'id специализации должен быть положительным числом' })
  firstSpecializationId: number;
  @ApiProperty({
    description: 'secondSpecializationId',
    example: 2,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'id специализации должен быть числом' })
  @IsInt({ message: 'id специализации должен быть целым числом' })
  @IsPositive({ message: 'id специализации должен быть положительным числом' })
  secondSpecializationId: number;
  @ApiProperty({
    description: 'thirdSpecializationId',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'id специализации должен быть числом' })
  @IsInt({ message: 'id специализации должен быть целым числом' })
  @IsPositive({ message: 'id специализации должен быть положительным числом' })
  thirdSpecializationId: number;
  @ApiProperty({
    description: 'level',
    example: 'Middle',
  })
  @IsOptional()
  @IsString({ message: 'Уровень должен быть строкой' })
  level: string;
  @ApiProperty({
    description: 'experience',
    example: 'Менее года',
  })
  @IsOptional()
  @IsString({ message: 'Опыт работы должен быть строкой' })
  experience: string;
  @ApiProperty({
    description: 'about',
    example: 'Я backend разработчик, пишу код на NestJs и учусь.',
  })
  @IsOptional()
  @IsString({ message: '"О себе" должно быть строкой' })
  about: string;
  @ApiProperty({
    description: 'website',
    example: 'best-backend.ru',
  })
  @IsOptional()
  @IsString({ message: 'Ссылка на сайт должна быть строкой' })
  website: string;
  @ApiProperty({
    description: 'phoneNumber',
    example: '+79860271933',
  })
  @IsOptional()
  @IsString({ message: 'номер телефона быть строкой' })
  phoneNumber: string;
  @ApiProperty({
    description: 'email',
    example: 'vitaly.sadikov1@yandex.ru',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Неверный формат почты' })
  @IsString({ message: 'Почта должна быть строкой' })
  email: string;
  @ApiProperty({
    description: 'vk',
    example: 'vk.com/sobaka',
  })
  @IsOptional()
  @IsString({ message: 'Ссылка на ВК должна быть строкой' })
  vk: string;
  @ApiProperty({
    description: 'telegram',
    example: '@ciganit',
  })
  @IsOptional()
  @IsString({ message: 'Ссылка на телеграм должна быть строкой' })
  telegram: string;
}
