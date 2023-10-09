import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { Track } from './entity/track.entity';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Track, Equipment])],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
