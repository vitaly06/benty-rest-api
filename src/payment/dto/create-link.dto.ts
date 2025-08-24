import { ApiProperty } from '@nestjs/swagger';

export class CreateLinkRequest {
  @ApiProperty()
  subscriptionId: number;
}
