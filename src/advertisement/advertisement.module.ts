import { Module } from '@nestjs/common';
import { AdvertisementService } from './advertisement.service';
import { AdvertisementController } from './advertisement.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/advertisements',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 100, // 100 mb
        files: 1024 * 1024 * 100,
        fieldSize: 1024 * 1024 * 150,
      },
    }),
  ],
  controllers: [AdvertisementController],
  providers: [AdvertisementService],
})
export class AdvertisementModule {}
