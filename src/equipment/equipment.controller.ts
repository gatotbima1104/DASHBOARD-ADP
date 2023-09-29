import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('equipment')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  // @Post()
  // create(@Body() createEquipmentDto: CreateEquipmentDto) {
  //   return this.equipmentService.create(createEquipmentDto);
  // }
  @Get()
  findAll(@Query('isSafe') isSafe: boolean, @Query('helm') helm: string) {
    if(isSafe){
      return this.equipmentService.getFilterUser(isSafe);
    }else if(helm){
      return this.equipmentService.getFilterEquipment(helm);
    }else{
      return this.equipmentService.findAll()
    }
  }
}
