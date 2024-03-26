import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { KategoriService } from './kategori.service';
import {
  CreateKategoriDto,
  UpdateKategoriDto,
  createKategoriArrayDto,
  findAllKategori,
} from './kategori.dto';
import { JwtGuard } from '../auth/auth.guard';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { InjectUpdatedBy } from 'src/utils/decorator/updatedby';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { InjectBulkCreatedBy } from 'src/utils/decorator/bulkcreatedby';
@UseGuards(JwtGuard)
@Controller('kategori')
export class KategoriController {
  constructor(private kategoriService: KategoriService) {}
  @Post('create')
  async create(@InjectCreatedBy() payload: CreateKategoriDto) {
    return this.kategoriService.create(payload);
  }

  @Put('update/:id')
  findOnepembelian(
    @Param('id') id: string,
    @InjectUpdatedBy() payload: UpdateKategoriDto,
  ) {
    return this.kategoriService.update(Number(id), payload);
  }

  @Get('detail/:id')
  getDetail(@Param('id') id: string) {
    return this.kategoriService.getDetail(Number(id));
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.kategoriService.delete(+id);
  }

  @Get('list')
  async getAllCategory(@Pagination() query: findAllKategori) {
    return this.kategoriService.getAllCategory(query);
  }

  @Get('user/list')
  async getUserCategory() {
    return this.kategoriService.getUserCategory();
  }

  @Post('create/bulk')
  createbulk(@InjectBulkCreatedBy() payload: createKategoriArrayDto) {
    return this.kategoriService.bulkCreate(payload);
  }
}
