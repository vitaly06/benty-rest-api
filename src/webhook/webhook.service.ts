import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly client: jwksClient.JwksClient;

  constructor() {
    this.client = jwksClient({
      jwksUri: 'https://enter.tochka.com/uapi/.well-known/jwks.json',
      timeout: 30000,
    });
  }

  async verifyWebhookToken(jwtToken: string): Promise<any> {
    try {
      this.logger.log('🔐 Verifying JWT token...');
      this.logger.log(`📏 Token length: ${jwtToken.length}`);

      // Декодируем header чтобы получить kid
      const decodedHeader = jwt.decode(jwtToken, { complete: true })?.header;

      if (!decodedHeader) {
        throw new Error('Failed to decode JWT header');
      }

      if (!decodedHeader.kid) {
        throw new Error('No kid found in JWT header');
      }

      this.logger.log(`🔑 Kid from header: ${decodedHeader.kid}`);

      // Получаем публичный ключ
      const key = await this.client.getSigningKey(decodedHeader.kid);
      const publicKey = key.getPublicKey();

      // Верифицируем JWT
      return new Promise((resolve, reject) => {
        jwt.verify(
          jwtToken,
          publicKey,
          {
            algorithms: ['RS256'],
            issuer: 'https://enter.tochka.com',
            ignoreExpiration: false,
          },
          (err, decoded) => {
            if (err) {
              this.logger.error('❌ JWT verification failed:', err.message);
              reject(err);
            } else {
              this.logger.log('✅ JWT verified successfully');
              resolve(decoded);
            }
          },
        );
      });
    } catch (error) {
      this.logger.error('💥 Token verification error:', error.message);
      throw error;
    }
  }

  inspectToken(token: string): any {
    try {
      const decoded = jwt.decode(token, { complete: true });
      this.logger.log('🔍 Token inspection result:', !!decoded);
      return decoded;
    } catch (error) {
      this.logger.error('❌ Token inspection failed:', error);
      return null;
    }
  }
}
