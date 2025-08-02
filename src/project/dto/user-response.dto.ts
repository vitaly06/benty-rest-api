import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ nullable: true })
  logoFileName: string | null;

  @ApiProperty({ type: [String] })
  specializations: string[];
}
