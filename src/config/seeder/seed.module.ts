import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seedOrmConfig } from 'src/config/database/typeorm.config';
import { SeedService } from './seed.service';
import { UserSeeder } from './user.seeder';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(seedOrmConfig),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [SeedService, UserSeeder],
})
export class SeedModule {}