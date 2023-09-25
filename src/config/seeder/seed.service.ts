import { Injectable, Logger } from '@nestjs/common';
import { UserSeeder } from './user.seeder';

@Injectable()
export class SeedService {
  private readonly seeders: any[] = [];
  private readonly logger = new Logger('seeder');

  constructor(
    private readonly userSeeder: UserSeeder,
  ) {
    this.seeders = [this.userSeeder];
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