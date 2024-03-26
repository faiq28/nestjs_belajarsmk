import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import {
  CreateBookDto,
  FindBookDto,
  createBookArrayDto,
  deleteBookArrayDto,
} from './book.dto';
import { InjectRepository } from '@nestjs/typeorm'; // import injectReposity
import { Book } from './book.entity'; // import Book Entiy
import { Between, Like, Repository } from 'typeorm'; //import repository
import { UpdateBookDto } from './book.dto';
import BaseResponse from 'src/utils/response/base.response';

@Injectable()
export class BookService extends BaseResponse {
  //inject book repository ke service
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {
    super();
  }

  private books: {
    id?: number;
    title: string;
    author: string;
    year: number;
  }[] = [
    {
      id: 1,
      title: 'HTML CSS',
      author: 'Faiq Afif',
      year: 2023,
    },
  ];

  async getAllBook(query: FindBookDto): Promise<ResponsePagination> {
    const { page, pageSize, limit, title, author, from_year, to_year } = query;

    console.log('q', query);
    const total = await this.bookRepository.count();

    const filter: {
      [key: string]: any;
    } = {};

    if (title) {
      filter.title = Like(`%${title}%`);
    }
    if (author) {
      filter.author = Like(`%${author}%`);
    }

    if (from_year && to_year) {
      filter.year = Between(from_year, to_year);
    }

    if (from_year && !!to_year === false) {
      filter.year = Between(from_year, from_year);
    }

    const result = await this.bookRepository.find({
      where: filter,
      skip: limit,
      take: pageSize,
    });

    return this._pagination('OK', result, total, page, pageSize); // implementasi method _pagination disini
  }

  async createBook(createBookDto: CreateBookDto): Promise<ResponseSuccess> {
    const { title, author, year } = createBookDto;

    try {
      await this.bookRepository.save({
        title: title,
        author: author,
        year: year,
      });
      return this._success('OK'); // implementasi method _success disini
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const detailBook = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (detailBook === null) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }
    return {
      status: 'Success',
      message: 'Detail Buku ditermukan',
      data: detailBook,
    };
  }

  private findBookById(id: number): number {
    const bookIndex = this.books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      throw new NotFoundException(`Buku dengan Id ${id} tidak dapat ditemukan`);
    }
    return bookIndex;
  }

  async updateBook(
    id: number,
    updateBookDto: UpdateBookDto,
  ): Promise<ResponseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);

    const update = await this.bookRepository.save({ ...updateBookDto, id: id });
    return {
      status: `Success `,
      message: 'Buku berhasil di update',
      data: update,
    };
  }

  async deleteBook(id: number): Promise<ResponseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    await this.bookRepository.delete(id);
    return {
      status: `Success `,
      message: 'Berhasil menghapus buku',
    };
  }

  async bulkCreate(payload: createBookArrayDto): Promise<ResponseSuccess> {
    try {
      console.log('pay', payload);
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {
            await this.bookRepository.save(item);
            berhasil = berhasil + 1;
          } catch {
            gagal = gagal + 1;
          }
        }),
      );

      return {
        status: 'ok',
        message: `Berhasil menambahkan buku sebanyak ${berhasil} dan sebanyak ${gagal}`,
        data: payload,
      };
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async bulkDelete(payload: deleteBookArrayDto): Promise<ResponseSuccess> {
    try {
      let success = 0;
      let fail = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          const checks = await this.bookRepository.delete(item);
          try {
            if (checks.affected === 0) {
              fail = fail + 1;
            } else {
              success = success + 1;
            }
          } catch (error) {
            fail = fail + 1;
          }
        }),
      );
      return {
        status: 'Ok',
        message: `Books succesfuly delete sebanyak ${success} dan gagal ${fail}`,
        data: payload,
      };
    } catch (error) {
      throw new HttpException('ada kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
  // updateBook(
  //   id: number,
  //   title: string,
  //   author: string,
  //   year: number,
  // ): {
  //   status: string;
  //   message: string;
  // } {
  //   const bookIndex = this.books.findIndex((book) => book.id === id);
  //   this.books[bookIndex].title = title;
  //   this.books[bookIndex].author = author;
  //   this.books[bookIndex].year = year;

  //   return {
  //     status: 'Success',
  //     message: 'Buku berhasil di update',
  //   };
  // }

  // deleteBook(id: number): {
  //   status: string;
  //   message: string;
  // } {
  //   const bookIndex = this.findBookById(id);
  //   this.books.splice(bookIndex, 1);
  //   return {
  //     status: `Success ${bookIndex}`,
  //     message: `${bookIndex} berhasil Di hapus`,
  //   };
  // }
}
