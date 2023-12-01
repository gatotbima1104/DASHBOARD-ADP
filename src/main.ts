import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/'
  })
   
  const config = new DocumentBuilder()
    .setTitle('Dashboard Wika')
    .setDescription('Dashboard Documentation')
    .setVersion('1.0')
    .addTag('Dashboard')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
   
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  
  app.enableCors({
    // IP James
    origin: '*',
    methods: 'GET,PATCH,POST,DELETE',
  })
  await app.listen(3000);
}
bootstrap();
