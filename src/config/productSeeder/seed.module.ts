import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seedOrmConfig } from 'src/config/database/typeorm.config';
import { SeedProduct} from './seed.service';
import { ProductSeeder } from './product.seeder';
import { Product } from 'src/products/entity/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(seedOrmConfig),
    TypeOrmModule.forFeature([Product]),
  ],
  providers: [SeedProduct, ProductSeeder],
})
export class ProductSeed {}