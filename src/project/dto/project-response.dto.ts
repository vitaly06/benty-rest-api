import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description?: string;

  @ApiProperty({ nullable: true })
  photoName?: string;

  @ApiProperty({ nullable: true })
  firstLink?: string;

  @ApiProperty({ nullable: true })
  secondLink?: string;

  @ApiProperty()
  categoryId: number;

  @ApiProperty({ nullable: true })
  specializationId?: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({ type: Object, nullable: true })
  content?: any;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
