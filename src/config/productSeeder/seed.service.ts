import { Injectable, Logger } from '@nestjs/common';
import { ProductSeeder } from './product.seeder';

@Injectable()
export class SeedProduct {
  private readonly seeders: any[] = [];
  private readonly logger = new Logger('seeder');

  constructor(
    private readonly productSeeder: ProductSeeder,
  ) {
    this.seeders = [this.productSeeder];
  }

  async seed() {
    await Promise.all(
      this.seeders.map((seeder) => {
        this.logger.log(`Seeding ${seeder.constructor.name}`);
        return seeder.seed();
      }),
    );
  }
}