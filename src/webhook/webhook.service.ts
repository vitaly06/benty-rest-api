import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly client: jwksClient.JwksClient;

  constructor() {
    this.client = jwksClient({
      jwksUri: 'https://enter.tochka.com/.well-known/jwks.json',
      timeout: 30000, // 30 секунд таймаут
    });
  }

  // Получение публичного ключа
  private getKey(header: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.getSigningKey(header.kid, (err, key) => {
        if (err) {
          this.logger.error('Error getting signing key:', err);
          reject(err);
          return;
        }

        try {
          const signingKey = key.getPublicKey();
          resolve(signingKey);
        } catch (error) {
          this.logger.error('Error extracting public key:', error);
          reject(error);
        }
      });
    });
  }

  // Верификация JWT токена вебхука
  async verifyWebhookToken(token: string): Promise<any> {
    try {
      // Сначала декодируем без верификации для получения header
      const decodedHeader = jwt.decode(token, { complete: true })?.header;

      if (!decodedHeader || !decodedHeader.kid) {
        throw new Error('Invalid JWT token or missing kid');
      }

      // Получаем публичный ключ
      const publicKey = await this.getKey(decodedHeader);

      // Верифицируем токен
      return new Promise((resolve, reject) => {
        jwt.verify(
          token,
          publicKey,
          {
            algorithms: ['RS256'],
            issuer: 'https://enter.tochka.com',
          },
          (err, decoded) => {
            if (err) {
              this.logger.error('JWT verification failed:', err);
              reject(err);
            } else {
              resolve(decoded);
            }
          },
        );
      });
    } catch (error) {
      this.logger.error('Token verification error:', error);
      throw error;
    }
  }

  // Альтернативный метод: декодирование без верификации (если нужна отладка)
  async decodeWebhookToken(token: string): Promise<any> {
    try {
      return jwt.decode(token);
    } catch (error) {
      this.logger.error('Token decoding failed:', error);
      throw error;
    }
  }
}
