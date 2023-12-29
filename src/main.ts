import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(helmet());
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  if (configService.get('NODE_ENV') === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Service desk API')
      .addBearerAuth({
        description: `
        Admin: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluIiwic3ViIjoxLCJpYXQiOjE2OTM1NTU1MDUsImV4cCI6MTcyNTA5MTUwNX0.v4FOM6hYBKKmjdztVruCJDkoFeHrCKhF8VGbEdX9LXU
        Engineer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImVuZ2luZWVyIiwic3ViIjoyLCJpYXQiOjE2OTM1NTU1MzYsImV4cCI6MTcyNTA5MTUzNn0.2OvtbMT14ojDZOTYKW5t384CAbMah-22xnECb2vzv1c
        Client: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImNsaWVudCIsInN1YiI6MywiaWF0IjoxNjkzNTU1NTcxLCJleHAiOjE3MjUwOTE1NzF9.9npcHMqv1mfZO2oRzmk-Z7zV_44rcGdPWGrL62JFm08
        `,
        type: 'http',
      })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
