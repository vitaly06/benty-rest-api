import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CreateLinkRequest } from './dto/create-link.dto';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-link')
  @UseGuards(JwtAuthGuard)
  async createLink(
    @Body() dto: CreateLinkRequest,
    @Req() req: RequestWithUser,
  ) {
    const paymentData = await this.paymentService.createLink(
      req.user.sub,
      dto.subscriptionId,
    );

    return {
      succes: true,
      data: paymentData,
    };
  }

  @Get('operation-info/:operationId')
  async getOperationInfo(@Param('operationId') operationId: string) {
    return await this.paymentService.getOperationInfo(operationId);
  }
}
