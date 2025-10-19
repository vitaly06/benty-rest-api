import { Module, forwardRef } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname, join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { ProjectModule } from 'src/project/project.module';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => BlogModule),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: (req, file, cb) => {
            let uploadPath = './uploads';
            if (req.path.includes('avatar')) {
              uploadPath = './uploads/avatars';
            } else if (req.path.includes('cover')) {
              uploadPath = './uploads/covers';
            }
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `${uniqueSuffix}${ext}`);
          },
        }),
      }),
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: `"Benty`,
      },
      template: {
        dir: join(__dirname, '../../templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
