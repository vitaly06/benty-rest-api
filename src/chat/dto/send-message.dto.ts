import { IsInt, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ description: 'ID получателя сообщения' })
  @IsInt()
  receiverId: number;

  @ApiProperty({ description: 'Текст сообщения' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiProperty({ description: 'Путь к файлу (если есть)' })
  filePath: string;
}
