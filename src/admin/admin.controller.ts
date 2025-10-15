import { Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary: 'Получение всех пользователей для админ панели',
  })
  @Get('all-users')
  async findAllUsers() {
    return await this.adminService.findAllUsers();
  }

  @ApiOperation({
    summary: 'Удаление пользователя',
  })
  @Delete('delete-user/:id')
  async deleteUser(id: string) {
    return await this.adminService.deleteUser(+id);
  }

  @ApiOperation({
    summary: 'Обновление подписки пользователя',
  })
  @Put('update-subscription/:userId')
  async updateSubscription(
    @Param('userId') userId: string,
    @Query('subscriptionId') subscriptionId: string,
  ) {
    return await this.adminService.updateSubscription(+userId, +subscriptionId);
  }

  @ApiOperation({
    summary: 'Блокировка пользователя',
  })
  @Put('ban-user/:id')
  async banUser(@Param('id') id: string) {
    return await this.adminService.banUser(+id);
  }

  @ApiOperation({
    summary: 'Разблокировка пользователя',
  })
  @Put('unban-user/:id')
  async unbanUser(@Param('id') id: string) {
    return await this.adminService.unbanUser(+id);
  }
}
