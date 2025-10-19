import { Module, forwardRef } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { StorageService } from 'src/storage/storage.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
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
        fileSize: 1024 * 1024 * 100, // 100 mb
        files: 1024 * 1024 * 100,
        fieldSize: 1024 * 1024 * 150,
      },
    }),
  ],
  controllers: [BlogController],
  providers: [BlogService, StorageService],
  exports: [BlogService],
})
export class BlogModule {}
