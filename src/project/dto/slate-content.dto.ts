import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SlateNodeDto {
  [key: string]: any;
}

export class SlateContentDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SlateNodeDto)
  children: SlateNodeDto[];
}
