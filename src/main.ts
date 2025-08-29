import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.use('/webhooks/tochka', bodyParser.raw({ type: 'text/plain' }));

  // Для остальных эндпоинтов используем JSON
  app.use(bodyParser.json({ limit: '50mb' }));

  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: true,
    // origin: [
    //   'http://localhost:5173',
    //   'http://89.169.179.243:5173',
    //   'https://89.169.179.243:5173',
    //   'http://frontend:5173',
    //   'https://frontend:5173',
    //   'http://benty.work',
    //   'https://benty.work',
    //   'http://www.benty.work',
    //   'https://www.benty.work',
    //   'http://localhost:3000',
    // ],
  });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Grinar REST API')
    .setDescription('Rest API for Grinar SMM')
    .setVersion('1.0.0')
    .setContact(
      'Vitaly Sadikov',
      'https://github.com/vitaly06',
      'vitaly.sadikov1@yandex.ru',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
