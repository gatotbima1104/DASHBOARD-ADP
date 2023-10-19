import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as http from 'http';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   
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
  
  app.enableCors()
  // const httpServer = http.createServer(app.getHttpAdapter().getInstance())
  // app.useWebSocketAdapter(new IoAdapter(httpServer))
  await app.listen(3000);
}
bootstrap();
