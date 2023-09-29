import { Injectable } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment) private equipRepo: Repository<Equipment>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ){}

  // create(createEquipmentDto: CreateEquipmentDto) {
  //   const user = 
  // }

  async findAll() {
    return await this.equipRepo.find({relations: ['user']})
  }

  async getFilterEquipment(helm: string){
    return this.equipRepo.createQueryBuilder('equipment')
      .select('equipment')
      .where('equipment.helm :helm', {helm: helm})
      .getMany()
  }

  // get user by filter isSafe
  async getFilterUser(isSafe: boolean){
    return this.equipRepo.createQueryBuilder('equipment')
      .select('equipment')
      .where('equipment.isSafe :isSafe', {isSafe: isSafe})
      .getMany()
  }
}
