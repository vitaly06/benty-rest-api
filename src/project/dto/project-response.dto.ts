import { ApiProperty } from '@nestjs/swagger';

class AuthorDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  avatar: string | null;

  @ApiProperty({ type: [String] })
  specializations: string[];
}

class CategoryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class ProjectResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  coverImage: string | null;

  @ApiProperty()
  content: any;

  @ApiProperty({ type: AuthorDto })
  author: AuthorDto;

  @ApiProperty({ type: CategoryDto })
  category: CategoryDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
