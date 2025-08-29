import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  async verifyWebhookToken(jwtToken: string): Promise<any> {
    try {
      this.logger.log('🔐 Verifying JWT token...');

      // Декодируем JWT для анализа
      const decoded = jwt.decode(jwtToken, { complete: true });

      if (!decoded) {
        throw new Error('Failed to decode JWT');
      }

      this.logger.log(`📋 JWT Header: ${JSON.stringify(decoded.header)}`);

      // Используем статический публичный ключ в правильном формате
      const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAraJQJyBXIgS1YzYFkmQG
q5XtadLVvMcx5u+guR2r5ZgSb+HGUG7HF5NM+NJeL9YrVtjjGf8VNLpwGbeejsS9
LRniPfKkCYaVqV1DSGOZ6RTOtqN3jKW1W86cVb+LffrQo3eFhPX5V464uduPu9Ro
uFplQ7wprY5ewke0Yj0FCOr6Ebxlpql+aJp/wk8JSzzFN17IC5tfUXgGDjEmnMjx
ag/CntnJtKWmw69ivhrq5sTPspclL3Ij8K/Qk0MwAZFCci25WxIuKQe7Mk4dvay6
CUfrCbAgEtqMcWUSqoG7pdBig59lo+kIMWvVQIAWjo2JhI7VlI/ssvFtiJg5T9my
E914aESFZ8jEheQv+4kZ81F0qk02k2mJ4C7AasGhbzC4F8YQ7nbr49v1n/j8udNZ
ZXA8vI2hacG517A66+uvEHIxXRUo/gIcubR+vdbJbaK/k8JRLJNmdf4B9HchJ6VD
9aGjMT0GYfhQ8jf16E1L/U4G4XLB5cnb0h88PD2MaMGP
-----END PUBLIC KEY-----`;

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
      this.logger.log('🔍 Token inspection successful');
      if (decoded) {
        this.logger.log(`📋 Header: ${JSON.stringify(decoded.header)}`);
        this.logger.log(
          `🔑 Payload keys: ${Object.keys(decoded.payload || {}).join(', ')}`,
        );
      }
      return decoded;
    } catch (error) {
      this.logger.error('❌ Token inspection failed:', error);
      return null;
    }
  }
}
