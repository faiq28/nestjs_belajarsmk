import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Produk } from './produk.entity';
import { Between, Like, Repository } from 'typeorm';
import {
  CreateProdukArrayDto,
  deleteProdukArrayDto,
  findAllProduk,
} from './produk.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { UpdateProdukDto } from './produk.dto';
@Injectable()
export class ProdukService extends BaseResponse {
  constructor(
    @InjectRepository(Produk)
    private readonly produkRepository: Repository<Produk>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async createBulk(payload: CreateProdukArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (data) => {
          const dataSave = {
            ...data,
            kategori: {
              id: data.kategori_id,
            },
            created_by: {
              id: this.req.user.id,
            },
          };

          try {
            await this.produkRepository.save(dataSave);

            berhasil += 1;
          } catch (err) {
            console.log('err', err);
            gagal += 1;
          }
        }),
      );

      return this._success(`Berhasil menyimpan ${berhasil} dan gagal ${gagal}`);
    } catch (err) {
      console.log('err', err);
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const detail = await this.produkRepository.findOne({
      where: {
        id: id,
      },
    });
    if (detail === null) {
      throw new NotFoundException(`produk dengna id ${id} tidak ditemukan`);
    }
    return {
      status: 'ok',
      message: 'berhasil',
      data: detail,
    };
  }

  async delete(id: number): Promise<ResponseSuccess> {
    const delet = await this.produkRepository.findOne({
      where: {
        id: id,
      },
    });

    if (delet === null) {
      throw new NotFoundException(`produk dengan id ${id} tidak di temukan`);
    }
    const hapus = await this.produkRepository.delete(id);
    return {
      status: 'ok',
      message: 'Berhasil Menghapus produk',
      data: hapus,
    };
  }

  async bulkDelete(payload: deleteProdukArrayDto): Promise<ResponseSuccess> {
    try {
      let success = 0;
      let fail = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          const checks = await this.produkRepository.delete(item);
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
        message: `produk sukses dihapus sebanyak ${success} dan gagal ${fail}`,
        data: payload,
      };
    } catch (error) {
      throw new HttpException('ada kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, payload: UpdateProdukDto): Promise<ResponseSuccess> {
    const kat = await this.produkRepository.findOne({
      where: {
        id: id,
      },
    });

    if (kat === null) {
      throw new NotFoundException(`kategori dengan id ${id} tidak di temukan`);
    }

    try {
      await this.produkRepository.save({ ...payload, id: id });
      return this._success('OK', this.req.user.user_id);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async findAll(query: findAllProduk): Promise<ResponsePagination> {
    const {
      page,
      pageSize,
      limit,
      nama_produk,
      dari_harga,
      sampai_harga,
      deskripsi_produk,
      nama_kategori,
    } = query;

    const filterQuery: any = {};
    if (deskripsi_produk) {
      filterQuery.deskripsi_produk = Like(`%${deskripsi_produk}%`);
    }
    if (nama_produk) {
      filterQuery.nama_produk = Like(`%${nama_produk}%`);
    }
    if (nama_kategori) {
      filterQuery.kategori = {
        nama_kategori: Like(`%${nama_kategori}%`),
      };
    }
    if (dari_harga && sampai_harga) {
      filterQuery.harga = Between(dari_harga, sampai_harga);
    }
    if (dari_harga && !!sampai_harga === false) {
      filterQuery.harga = Between(dari_harga, dari_harga);
    }
    const total = await this.produkRepository.count({
      where: filterQuery,
    });
    const result = await this.produkRepository.find({
      where: filterQuery,
      relations: ['created_by', 'updated_by', 'kategori'],
      select: {
        id: true,
        nama_produk: true,
        deskripsi_produk: true,
        stok: true,
        harga: true,
        kategori: {
          id: true,
          nama_kategori: true,
        },
        created_by: {
          id: true,
          nama: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
      },
      skip: limit,
      take: pageSize,
    });
    return this._pagination('OK', result, total, page, pageSize);
  }
}
