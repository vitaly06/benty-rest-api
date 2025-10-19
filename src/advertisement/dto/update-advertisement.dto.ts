import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { AdvertisementType } from '../enum/advertisement.enum';
import { Type } from 'class-transformer';

export class UpdateAdvertisementDto {
  @ApiProperty({
    description: 'Тип объявления',
    enum: AdvertisementType,
    example: AdvertisementType.VACANCY,
    required: false,
  })
  @IsEnum(AdvertisementType, { message: 'Неккоретный тип объявления' })
  @IsOptional()
  type?: AdvertisementType;

  @ApiProperty({
    description: 'Название вакансии',
    example: 'Frontend Developer',
    required: false,
  })
  @IsString({ message: 'Название вакансии должно быть строкой' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Название компании',
    example: 'Prostor Dev',
    required: false,
  })
  @IsString({ message: 'Название компании должно быть строкой' })
  @IsOptional()
  companyName?: string;

  @ApiProperty({
    description: 'Тип занятости',
    example: 'Фулл-тайм',
    required: false,
  })
  @IsString({ message: 'Тип занятости должен быть строкой' })
  @IsOptional()
  employmentType?: string;

  @ApiProperty({
    description: 'Формат работы',
    example: 'Удалённо',
    required: false,
  })
  @IsString({ message: 'Формат работы должен быть строкой' })
  @IsOptional()
  jobFormat?: string;

  @ApiProperty({
    description: 'Чем предстоит заниматься',
    example: 'Верстать страницы с использованием Vite и React',
    required: false,
  })
  @IsString({ message: 'Чем предстоить заниматься должно быть строкой' })
  @IsOptional()
  whatToDo?: string;

  @ApiProperty({
    description: 'Что ждём от кандидата',
    example: 'Хорошее знание React, JS, TypeScript и 1 год коммерческого опыта',
    required: false,
  })
  @IsString({ message: 'Что ждём от кандидата должно быть строкой' })
  @IsOptional()
  expectations?: string;

  @ApiProperty({
    description: 'Что предлагаем',
    example:
      'График работы - пятидневка\nФорма занятости - Полный рабочий день\nОформление по ТК',
    required: false,
  })
  @IsString({ message: 'Что предлагаем должно быть строкой' })
  @IsOptional()
  weOffer?: string;

  @ApiProperty({
    description: 'Минимальная зарплата',
    example: 10000,
    required: false,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Минимальная ЗП должна быть числом' })
  @IsPositive({ message: 'Минимальная ЗП должна быть положительным числом' })
  @IsOptional()
  minWage?: number;

  @ApiProperty({
    description: 'Максимальная зарплата',
    example: 30000,
    required: false,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Максимальная ЗП должна быть числом' })
  @IsPositive({ message: 'Максимальная ЗП должна быть положительным числом' })
  @IsOptional()
  maxWage?: number;

  @ApiProperty({ description: 'Валюта', example: '$', required: false })
  @IsString({ message: 'Валюта должна быть строкой' })
  @IsOptional()
  currency?: string;

  @ApiProperty({
    description: 'Аккаунт телеграм',
    example: '@ciganit',
    required: false,
  })
  @IsString({ message: 'Телеграм должен быть строкой' })
  @IsOptional()
  telegram?: string;

  @ApiProperty({
    description: 'Аккаунт ВК',
    example: 'https://vk.com/bimbimbambam_ia',
    required: false,
  })
  @IsString({ message: 'ВК должен быть строкой' })
  @IsOptional()
  vk?: string;

  @ApiProperty({
    description: 'Почта',
    example: 'vitaly.sadikov1@yandex.ru',
    required: false,
  })
  @IsString({ message: 'Почта должна быть строкой' })
  @IsEmail({}, { message: 'Неверный формат почты' })
  @IsOptional()
  email?: string;
}
