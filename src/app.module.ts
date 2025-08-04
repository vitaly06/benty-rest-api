import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProjectModule } from './project/project.module';
import { SpecializationModule } from './specialization/specialization.module';
import { PhotoModule } from './photo/photo.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

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
    PhotoModule,
    CacheModule.register({
      ttl: 0,
      isGlobal: true,
      store: redisStore,
      // host: 'localhost',
      host: 'redis',
      port: 6379,
    }),
  ],
})
export class AppModule {}
