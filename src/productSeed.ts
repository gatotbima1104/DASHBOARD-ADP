import { NestFactory } from '@nestjs/core';
import { SeedProduct } from './config/productSeeder/seed.service';
import { ProductSeed } from './config/productSeeder/seed.module';


async function bootstrap() {
  const app = await NestFactory.create(ProductSeed);
  const seeder = app.get(SeedProduct);
  await seeder.seed();
  await app.close();
}

bootstrap();