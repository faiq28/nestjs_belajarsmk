import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  // Query,
} from '@nestjs/common';
import { MobilService } from './mobil.service';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import {
  CreateMobilArrayDto,
  CreateMobilDto,
  FindMobilDto,
  UpdateMobilDto,
} from './mobil.dto';

@Controller('mobil')
export class MobilController {
  constructor(private mobilService: MobilService) {}

  @Get('/list')
  findAllBook(@Pagination() findMobilDto: FindMobilDto) {
    return this.mobilService.getAllMobil(findMobilDto);
  }

  @Post('/create')
  createBook(@Body() payload: CreateMobilDto) {
    return this.mobilService.createMobil(payload);
  }

  @Put('update/:id')
  updateMobil(@Param('id') id: number, @Body() updateMobilDto: UpdateMobilDto) {
    return this.mobilService.updateMobil(Number(id), updateMobilDto);
  }

  @Get('detail/:id')
  findOneMobil(@Param('id') id: string) {
    return this.mobilService.getDetail(Number(id));
  }

  @Delete('delete/:id')
  deleteMobil(@Param('id') id: string) {
    return this.mobilService.deleteMobil(+id);
  }

  @Post('create/bulk')
  createBulk(@Body() payload: CreateMobilArrayDto) {
    console.log('pay', payload);
    return this.mobilService.bulkCreate(payload);
  }
}
