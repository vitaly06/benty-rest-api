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
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 600000, // 10 минут
    });
  }

  private getKey(header: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.getSigningKey(header.kid, (err, key) => {
        if (err) {
          this.logger.error('Error getting signing key:', err);
          reject(new Error(`Failed to get signing key: ${err.message}`));
          return;
        }

        try {
          const signingKey = key.getPublicKey();
          resolve(signingKey);
        } catch (error) {
          this.logger.error('Error extracting public key:', error);
          reject(new Error('Failed to extract public key'));
        }
      });
    });
  }

  async verifyWebhookToken(token: string): Promise<any> {
    try {
      // Проверяем, что токен не пустой
      if (!token || token.trim().length === 0) {
        throw new Error('Empty JWT token received');
      }

      // Декодируем header для получения kid
      const decodedHeader = jwt.decode(token, { complete: true })?.header;

      if (!decodedHeader) {
        throw new Error('Failed to decode JWT header');
      }

      if (!decodedHeader.kid) {
        throw new Error('JWT token missing kid in header');
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
            ignoreExpiration: false, // Не игнорируем expiration
          },
          (err, decoded) => {
            if (err) {
              this.logger.error('JWT verification failed:', err.message);
              reject(new Error(`JWT verification failed: ${err.message}`));
            } else {
              resolve(decoded);
            }
          },
        );
      });
    } catch (error) {
      this.logger.error('Token verification error:', error.message);
      throw error;
    }
  }

  // Метод для быстрой проверки структуры токена без верификации
  inspectToken(token: string): any {
    try {
      return jwt.decode(token, { complete: true });
    } catch (error) {
      this.logger.error('Token inspection failed:', error);
      return null;
    }
  }
}
