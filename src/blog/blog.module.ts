import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from 'src/auth/strategies/jwt-refresh.strategy';
import { StorageService } from 'src/storage/storage.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/blogs',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 50, // 50 mb
        files: 1024 * 1024 * 50,
        fieldSize: 1024 * 1024 * 50,
      },
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [BlogController],
  providers: [
    BlogService,
    JwtAuthGuard,
    JwtStrategy,
    JwtRefreshStrategy,
    StorageService,
  ],
})
export class BlogModule {}
