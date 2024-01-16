import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import {
  CreateProdukDto,
  DeleteProdukArrayDto,
  FindProdukDto,
  UpdateProdukDto,
  createProdukArrayDto,
} from './produk.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('produk')
export class ProdukController {
  constructor(private readonly produkService: ProdukService) {}

  @Get('/list')
  findAllProduk(@Pagination() findProdukDto: FindProdukDto) {
    return this.produkService.getAllProduk(findProdukDto);
  }

  @Get('detail/:id')
  findOneProduk(@Param('id') id: string) {
    return this.produkService.getDetail(Number(id));
  }

  @Post('/create')
  createProduk(@Body() payload: CreateProdukDto) {
    return this.produkService.createProduk(payload);
  }

  @Put('update/:id')
  updateProduk(
    @Param('id') id: string,
    @Body() updateProdukDto: UpdateProdukDto,
  ) {
    return this.produkService.updateProduk(Number(id), updateProdukDto);
  }

  @Delete('delete/:id')
  deleteProduk(@Param('id') id: string) {
    return this.produkService.deleteProduk(+id);
  }

  @Post('create/bulk')
  createBulk(@Body() payload: createProdukArrayDto) {
    return this.produkService.bulkCreate(payload);
  }

  @Post('/delete/bulk')
  deleteBulkProduk(@Body() payload: DeleteProdukArrayDto) {
    return this.produkService.bulkDelete(payload.data);
  }
}
