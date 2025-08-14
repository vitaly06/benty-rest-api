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
import { StorageModule } from './storage/storage.module';
import { CategoryModule } from './category/category.module';
import { BlogModule } from './blog/blog.module';
import * as redisStore from 'cache-manager-ioredis';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ChatModule,
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
      ttl: 60 * 60 * 100,
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      // host: 'redis',
      port: 6379,
    }),
    StorageModule,
    CategoryModule,
    BlogModule,
  ],
  providers: [], // Убрали WebSocketGateway отсюда
})
export class AppModule {}
