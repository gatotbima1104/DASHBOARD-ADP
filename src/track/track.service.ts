import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './entity/track.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track) private trackRepo: Repository<Track>,
  ){}

  async getAll(){
    return this.trackRepo.find()
  }
}
