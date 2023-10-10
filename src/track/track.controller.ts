import { Controller, Get } from '@nestjs/common';
import { TrackService } from './track.service';
import {ApiBearerAuth} from '@nestjs/swagger'

@ApiBearerAuth()
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async findAll(){
    return this.trackService.getAll()
  }
}
