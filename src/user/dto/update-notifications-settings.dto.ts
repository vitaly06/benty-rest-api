import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateNotificationsSettingsRequest {
  @ApiProperty({
    description: 'rewardNotifications',
    example: true,
  })
  @IsBoolean({ message: 'Настройка уведомлений должна быть Boolean' })
  rewardNotifications: boolean;
  @ApiProperty({
    description: 'weeklySummaryNotifications',
    example: true,
  })
  @IsBoolean({ message: 'Настройка уведомлений должна быть Boolean' })
  weeklySummaryNotifications: boolean;
  @ApiProperty({
    description: 'joinAuthorsNotifications',
    example: true,
  })
  @IsBoolean({ message: 'Настройка уведомлений должна быть Boolean' })
  joinAuthorsNotifiсations: boolean;
}
