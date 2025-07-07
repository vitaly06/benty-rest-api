import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProjectModule } from './project/project.module';
import { SpecializationModule } from './specialization/specialization.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    ProjectModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    SpecializationModule,
  ],
})
export class AppModule {}
