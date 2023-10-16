import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import {
  CreateUserDto,
  FindUserDto,
  UpdateUserDto,
  createUserArrayDto,
} from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  private user: {
    id: number;
    nama: string;
    email: string;
    umur: number;
    tanggal_lahir: string;
    status: string;
  }[] = [
    {
      id: 1,
      nama: 'Faiq Afif',
      email: 'faiqafifalthf@gmail.com',
      umur: 16,
      tanggal_lahir: '14 februari',
      status: 'pelajar',
    },
  ];

  async createUser(payload: CreateUserDto): Promise<ResponseSuccess> {
    const { nama, email, umur, tanggal_lahir, status } = payload;

    try {
      this.user.push({
        id: this.user.length,
        nama,
        email,
        umur,
        tanggal_lahir,
        status,
      });

      return {
        status: 'Berhasil',
        message: 'Berhasil menambahkan user',
      };
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllUser(findUserDto: FindUserDto): Promise<ResponsePagination> {
    const { page, pageSize, limit, title, author, from_year, to_year } =
      findUserDto;

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
    console.log('filter', filter);
    const result = await this.userRepository.find({
      where: filter,
      skip: limit,
      take: pageSize,
    });

    const total = await this.userRepository.count({
      where: filter,
    });
    return {
      status: 'Success',
      message: 'List User ditermukan',
      data: result,
      pagination: {
        total: total,
        page: page,
        pageSize: pageSize,
      },
    };
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const detailUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (detailUser === null) {
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
    }
    return {
      status: 'Success',
      message: 'Detail User ditermukan',
      data: detailUser,
    };
  }

  private findUserById(id: number): number {
    const userIndex = this.user.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User dengan Id ${id} tidak dapat ditemukan`);
    }
    return userIndex;
  }

  async updateUser(
    id: number,
    UpdateUserDto: UpdateUserDto,
  ): Promise<ResponseSuccess> {
    const check = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);

    const update = await this.userRepository.save({ ...UpdateUserDto, id: id });
    return {
      status: `Success `,
      message: 'Buku berhasil di update',
      data: update,
    };
  }

  async deleteUser(id: number): Promise<ResponseSuccess> {
    const check = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
    await this.userRepository.delete(id);
    return {
      status: `Success `,
      message: 'Berhasil menghapus user',
    };
  }

  async bulkCreate(payload: createUserArrayDto): Promise<ResponseSuccess> {
    try {
      console.log('pay', payload);
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {
            await this.userRepository.save(item);
            berhasil = berhasil + 1;
          } catch {
            gagal = gagal + 1;
          }
        }),
      );

      return {
        status: 'ok',
        message: `Berhasil menambahkan User sebanyak ${berhasil} dan sebanyak ${gagal}`,
        data: payload,
      };
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
