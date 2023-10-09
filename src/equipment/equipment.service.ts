import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { Track } from 'src/track/entity/track.entity';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment) private equipRepo: Repository<Equipment>,
    @InjectRepository(Track) private trackRepo: Repository<Track>,
  ) {}

  // get all done
  async findAllFilterByDate(page: number = 1, date: string) {
    const query = this.equipRepo.createQueryBuilder('equipment');

    if (date) {
      query.where('DATE(equipment.timestamp) = :date', { date });
    }
    // const equipments = await this.equipRepo.find({
    //   relations: ['track'],
    //   take: 3,
    //   skip: 3 * (page - 1),
    // })
    const pageSize = 3;
    const [records, total] = await query
      .orderBy('equipment.timestamp', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      records,
      total,
    };
  }

  //filter by date done
  async sortByDate(date: string) {
    return await this.equipRepo
      .createQueryBuilder('equipment')
      .select('equipment')
      .where('DATE(equipment.timestamp) = :date', { date })
      .getMany();
  }

  async getFilterEquipment(
    page: number = 1,
    violance: boolean,
    helm: boolean,
    vest: boolean,
    boot: boolean,
  ) {
    const query = this.equipRepo.createQueryBuilder('equipment');

    if (helm) {
      query.where('equipment.helm = :helm', { helm });
    }
    else if (vest) {
      query.andWhere('equipment.vest = :vest', { vest });
    }
    if (boot) {
      query.andWhere('equipment.boot = :boot', { boot });
    }
    if (violance) {
      query.andWhere('equipment.violance = :violance', { violance });
    }

    const pageSize = 3;
    const [records, total] = await query
      .orderBy('equipment.timestamp', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      records,
      total,
    };
  }

  // get user by filter isSafe
  async getFilterByisSafe(isSafe: boolean) {
    return this.equipRepo
      .createQueryBuilder('track')
      .select('track')
      .where('track.isSafe = :isSafe', { isSafe })
      .getMany();
  }
}
