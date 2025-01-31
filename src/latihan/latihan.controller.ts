import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { LatihanService } from './latihan.service';

@Controller('latihan')
export class LatihanController {
  constructor(private latihanService: LatihanService) {}
  @Get()
  findAll(@Query() query: any) {
    return this.latihanService.Welcome();
  }

  @Post()
  create(@Body() payload: any) {
    console.log('payload', payload);
    return this.latihanService.hello();
  }

  @Post('create')
  create2(@Body('name') name: string, @Body('sekolah') sekolah: string) {
    console.log('name', name);
    console.log('sekolah', sekolah);

    return {
      name: name,
      sekolah: sekolah,
    };
  }

  @Put('update/:id/:nama')
  update(
    @Body() payload: any,
    @Param('id') id: string,
    @Param('nama') nama: string,
  ) {
    return {
      id: id,
      nama: nama,
      payload: payload,
    };
  }

  @Patch()
  patch() {
    return 'latihan menggunakan method PATCH';
  }

  @Delete('delete')
  delete() {
    return 'latihan menggunakan method DELETE';
  }
}
