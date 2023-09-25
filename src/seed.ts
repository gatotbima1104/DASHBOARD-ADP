import { NestFactory } from '@nestjs/core';
import { SeedModule } from './config/seeder/seed.module';
import { SeedService } from './config/seeder/seed.service';


async function bootstrap() {
  const app = await NestFactory.create(SeedModule);
  const seeder = app.get(SeedService);
  await seeder.seed();
  await app.close();
}

bootstrap();