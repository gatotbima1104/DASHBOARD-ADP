import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Equipment } from './entities/equipment.entity';
import { Track } from 'src/track/entity/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Equipment, Track])],
  controllers: [EquipmentController],
  providers: [EquipmentService],
})
export class EquipmentModule {}
