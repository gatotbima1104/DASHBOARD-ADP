import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterByEquipmentDto } from './dto/filter.equipment.dto';

@ApiBearerAuth()
@ApiTags('equipment')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  // get all done
  @Get()
  getAll(){
    return this.equipmentService.findAll()
  }

  //filter By Date done
  @Get('filter')
  filterByDate(@Query('date') date: string){
    return this.equipmentService.sortByDate(date)
  }


  // @Get()
  // findAll(@Query('isSafe') isSafe: boolean, @Query('helm') helm: string) {
  //   if(isSafe){
  //     return this.equipmentService.getFilterUser(isSafe);
  //   }else if(helm){
  //     return this.equipmentService.getFilterEquipment(helm);
  //   }else{
  //     return this.equipmentService.findAll()
  //   }
  // }

}
