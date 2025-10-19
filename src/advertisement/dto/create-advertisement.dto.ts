import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { AdvertisementType } from '../enum/advertisement.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class createAdvertisementDto {
  @ApiProperty({
    description: 'Тип объявления',
    enum: AdvertisementType,
    example: AdvertisementType.VACANCY,
  })
  @IsNotEmpty({ message: 'Тип объявления обязателен для заполнения' })
  @IsEnum(AdvertisementType, { message: 'Неккоретный тип объявления' })
  type: AdvertisementType;

  @ApiProperty({
    description: 'Название вакансии',
    example: 'Frontend Developer',
  })
  @IsNotEmpty({ message: 'Название вакансии обязательно для заполнения' })
  @IsString({ message: 'Название вакансии должно быть строкой' })
  name: string;
  @ApiProperty({
    description: 'Название компании',
    example: 'Prostor Dev',
  })
  @IsNotEmpty({ message: 'Название компании обязательно для заполнения' })
  @IsString({ message: 'Название компании должно быть строкой' })
  companyName: string;
  @ApiProperty({
    description: 'Тип занятости',
    example: 'Фулл-тайм',
  })
  @IsNotEmpty({ message: 'Тип занятости обязателен для заполнения' })
  @IsString({ message: 'Тип занятости должен быть строкой' })
  employmentType: string;
  @ApiProperty({
    description: 'Формат работы',
    example: 'Удалённо',
  })
  @IsNotEmpty({ message: 'Формат работы обязателен для заполнения' })
  @IsString({ message: 'Формат работы должен быть строкой' })
  jobFormat: string;
  @ApiProperty({
    description: 'Чем предстоит заниматься',
    example: 'Верстать страницы с использованием Vite и React',
  })
  @IsNotEmpty({
    message: '"Чем предстоить заниматься" обязательно для заполнения',
  })
  @IsString({ message: '"Чем предстоить заниматься" должно быть строкой' })
  whatToDo: string;
  @ApiProperty({
    description: 'Что ждём от кандидата',
    example: 'Хорошее знание React, JS, TypeScript и 1 год коммерческого опыта',
  })
  @IsNotEmpty({
    message: '"Что ждём от кандидата" обязательно для заполнения',
  })
  @IsString({ message: '"Что ждём от кандидата" должно быть строкой' })
  expectations: string;
  @ApiProperty({
    description: 'Что предлагаем',
    example:
      'График работы - пятидневка\nФорма занятости - Полный рабочий день\nОформление по ТК',
  })
  @IsNotEmpty({
    message: '"Что предлагаем" обязательно для заполнения',
  })
  @IsString({ message: '"Что предлагаем" должно быть строкой' })
  weOffer: string;
  @ApiProperty({
    description: 'Минимальная зарплата',
    example: 10000,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Минимальная ЗП должна быть числом' })
  @IsPositive({ message: 'Минимальная ЗП должна быть положительным числом' })
  @IsNotEmpty({ message: 'Минимальная ЗП обязательная для заполнения' })
  minWage: number;
  @ApiProperty({
    description: 'Максимальная зарплата',
    example: 30000,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Максимальная ЗП должна быть числом' })
  @IsPositive({ message: 'Максимальная ЗП должна быть положительным числом' })
  @IsNotEmpty({ message: 'Максимальная ЗП обязательная для заполнения' })
  maxWage: number;
  @ApiProperty({
    description: 'Валюта',
    example: '$',
  })
  @IsNotEmpty({
    message: 'Валюта обязательна для заполнения',
  })
  @IsString({ message: 'Валюта должна быть строкой' })
  currency: string;
  @ApiProperty({
    description: 'Аккаунт телеграм',
    example: '@ciganit',
  })
  @IsString({ message: 'Телеграм должен быть строкой' })
  @IsOptional()
  telegram: string;
  @ApiProperty({
    description: 'Аккаунт ВК',
    example: 'https://vk.com/bimbimbambam_ia',
  })
  @IsString({ message: 'ВК должен быть строкой' })
  @IsOptional()
  vk: string;
  @ApiProperty({
    description: 'Почта',
    example: 'vitaly.sadikov1@yandex.ru',
  })
  @IsString({ message: 'Почта должна быть строкой' })
  @IsEmail({}, { message: 'Неверный формат почты' })
  @IsOptional()
  email: string;
}
