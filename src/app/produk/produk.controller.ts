import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import {
  CreateProdukArrayDto,
  UpdateProdukDto,
  deleteProdukArrayDto,
  findAllProduk,
} from './produk.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@UseGuards(JwtGuard)
@Controller('produk')
export class ProdukController {
  constructor(private produkService: ProdukService) {}

  @Post('create-bulk')
  async createBulk(@Body() payload: CreateProdukArrayDto) {
    return this.produkService.createBulk(payload);
  }

  @Get('list')
  async findAll(@Pagination() query: findAllProduk) {
    return this.produkService.findAll(query);
  }

  @Get('detail/:id')
  getDetail(@Param('id') id: string) {
    return this.produkService.getDetail(Number(id));
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.produkService.delete(+id);
  }

  @Post('delete/bulk')
  deleteBulkProduk(@Body() payload: deleteProdukArrayDto) {
    return this.produkService.bulkDelete(payload);
  }

  @Put('update/:id')
  updateProduk(
    @Param('id') id: string,
    @Body() updateProdukDto: UpdateProdukDto,
  ) {
    return this.produkService.update(Number(id), updateProdukDto);
  }
}
