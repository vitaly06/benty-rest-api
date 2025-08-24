import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly client = jwksClient({
    jwksUri: 'https://enter.tochka.com/.well-known/jwks.json', // URL публичного ключа Точки
  });

  // Получение публичного ключа
  private getKey(header: any, callback: any) {
    this.client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        callback(err);
        return;
      }
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  }

  // Верификация JWT токена вебхука
  async verifyWebhookToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.getKey.bind(this),
        {
          algorithms: ['RS256'],
          issuer: 'https://enter.tochka.com', // Проверяем issuer
        },
        (err, decoded) => {
          if (err) {
            this.logger.error('Webhook token verification failed:', err);
            reject(err);
          } else {
            resolve(decoded);
          }
        },
      );
    });
  }
}
