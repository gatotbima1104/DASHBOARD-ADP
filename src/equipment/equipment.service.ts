import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { User } from 'src/user/entities/user.entity';
import { FilterByEquipmentDto } from './dto/filter.equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment) private equipRepo: Repository<Equipment>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ){}

  // get all done
  async findAll() {
    return await this.equipRepo.find({relations: ['user']})
  }

  //filter by date done
  async sortByDate(date: string){
    return await this.equipRepo.createQueryBuilder('equipment')
      .select('equipment')
      .where('DATE(equipment.timestamp) = :date', {date})
      .getMany()
  }

  async getFilterEquipment(dto: FilterByEquipmentDto){
    return this.equipRepo.createQueryBuilder('equipment')
      .select('equipment')
      .where('equipment.helm = :helm', {helm: dto.helm})
      .andWhere('equipment.vest = :vest', {vest: dto.vest})
      .andWhere('equipment.violance = :violance', {violance: dto.violance})
      .getMany()
  }

  // get user by filter isSafe
  // async getFilterUser(isSafe: boolean){
  //   return this.equipRepo.createQueryBuilder('equipment')
  //     .select('equipment')
  //     .where('equipment.isSafe :isSafe', {isSafe: isSafe})
  //     .getMany()
  // }
}
