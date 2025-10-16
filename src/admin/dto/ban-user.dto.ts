import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BanUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Причина бана обязательна для заполнения' })
  @IsString({ message: 'Причина бана должна быть строкой' })
  reason: string;
}
