import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  decodeWebhookToken(jwtToken: string): any {
    try {
      this.logger.log('🔐 Decoding JWT token...');

      // Просто декодируем JWT без верификации
      const decoded = jwt.decode(jwtToken, { complete: true });

      if (!decoded) {
        throw new Error('Failed to decode JWT');
      }

      this.logger.log('✅ JWT decoded successfully');
      return decoded.payload;
    } catch (error) {
      this.logger.error('💥 Token decoding error:', error.message);
      throw error;
    }
  }

  inspectToken(token: string): any {
    try {
      const decoded = jwt.decode(token, { complete: true });
      this.logger.log('🔍 Token inspection successful');
      return decoded;
    } catch (error) {
      this.logger.error('❌ Token inspection failed:', error);
      return null;
    }
  }
}
