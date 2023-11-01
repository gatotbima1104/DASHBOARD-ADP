import { Controller, Get, Query } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import {
  ApiBearerAuth,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

class FilterQuery {
  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  date: string;
}

@ApiBearerAuth()
@ApiTags('equipment')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  // GET ALL, FILTER BY DATE, PAGINATION
  @Get()
  @ApiQuery({
    name: 'date',
    type: 'date-time',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
  })
  getAll(@Query('page') page: number, @Query('date') date: string) {
    return this.equipmentService.findAllFilterByDate(page, date);
  }

  // SORT TRACK BY IS SAFE AND JABATAN
  @Get('sort')
  @ApiQuery({ name: 'isSafe', required: false })
  @ApiQuery({ name: 'jabatan', required: false, enum: ['worker', 'operator'] })
  sortByEquip(
    @Query('isSafe') isSafe: boolean,
    @Query('jabatan') jabatan: string,
  ) {
    return this.equipmentService.getFilterByisSafe(isSafe, jabatan);
  }

  @Get('filter')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'helm', required: false })
  @ApiQuery({ name: 'vest', required: false })
  @ApiQuery({ name: 'boot', required: false })
  @ApiQuery({ name: 'violance', required: false })
  getAllFilterByEquipment(
    @Query('page') page: number,
    @Query('helm') helm: boolean,
    @Query('vest') vest: boolean,
    @Query('boot') boot: boolean,
    @Query('violance') violance: boolean,
  ) {
    return this.equipmentService.getFilterEquipment(
      page,
      helm,
      vest,
      boot,
      violance,
    );
  }
}
