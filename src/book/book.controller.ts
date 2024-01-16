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
import { BookService } from './book.service';
import {
  CreateBookDto,
  deleteBookArrayDto,
  FindBookDto,
  createBookArrayDto,
} from './book.dto';
import { UpdateBookDto } from './book.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('/list')
  findAllBook(@Pagination() findBookDto: FindBookDto) {
    return this.bookService.getAllBook(findBookDto);
  }

  @Post('/create')
  createBook(@Body() payload: CreateBookDto) {
    return this.bookService.createBook(payload);
  }

  @Put('update/:id')
  updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBook(Number(id), updateBookDto);
  }

  @Get('detail/:id')
  findOneBook(@Param('id') id: string) {
    return this.bookService.getDetail(Number(id));
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(+id);
  }

  @Post('create/bulk')
  createBulk(@Body() payload: createBookArrayDto) {
    console.log('pay', payload);
    return this.bookService.bulkCreate(payload);
  }

  @Post('delete/bulk')
  deleteBulkBook(@Body() payload: deleteBookArrayDto) {
    return this.bookService.bulkDelete(payload);
  }
}
