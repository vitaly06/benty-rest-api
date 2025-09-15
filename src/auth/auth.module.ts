import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { CustomMailerModule } from 'src/mailer.module';
import { ProjectModule } from 'src/project/project.module';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    PassportModule,
    ProjectModule,
    BlogModule,
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
    CustomMailerModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    JwtAuthGuard,
    JwtRefreshStrategy,
  ],
  exports: [AuthModule],
})
export class AuthModule {}
