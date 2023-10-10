import { Controller, Get, Query } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('equipment')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  // GET ALL, FILTER BY DATE, PAGINATION
  @Get()
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'page', required: false })
  getAll(@Query('page') page: number, @Query('date') date: string){
    return this.equipmentService.findAllFilterByDate(page, date)
  }

  @Get('sort')
  sortByEquip(@Query('helm') helm: boolean, @Query('vest') vest: boolean){
    return this.equipmentService.filterByHelm(helm, vest)
  }

  //filter By Date done
  // @Get('filter')
  // filterByDate(
  // @Query('date') date: string,
  // @Query('isSafe') isSafe: boolean,
  // ){
  //   if(date){
  //     return this.equipmentService.sortByDate(date)
  //   }
  //   return this.equipmentService.getFilterByisSafe(isSafe)
  // }

  @Get('filter')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'helm', required: false })
  @ApiQuery({ name: 'vest', required: false })
  @ApiQuery({ name: 'boot', required: false })
  @ApiQuery({ name: 'violance', required: false })
  getAllFilterByEquipment(@Query('page') page: number, @Query('vest') vest: boolean, @Query('helm') helm: boolean, @Query('boot') boot: boolean, @Query('violance') violance: boolean){
    return this.equipmentService.getFilterEquipment(page, vest, helm, boot, violance)
  }


}
