import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Produk } from './produk.entity';
import {
  Between,
  DeepPartial,
  Like,
  OrderByCondition,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateProdukDto,
  FindProdukDto,
  UpdateProdukDto,
  createProdukArrayDto,
} from './produk.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import BaseResponse from 'src/utils/response/base.response';

@Injectable()
export class ProdukService extends BaseResponse {
  constructor(
    @InjectRepository(Produk)
    private produkRepository: Repository<Produk>,
  ) {
    super();
  }

  async getAllProduk(query: FindProdukDto): Promise<ResponsePagination> {
    const {
      page,
      pageSize,
      limit,
      nama_produk,
      kategori_produk,
      harga_produk,
      jumlah_produkFrom,
      jumlah_produkTo,
      tahun_pembuatanFrom,
      tahun_pembuatanTo,
      created_dateFrom,
      created_dateTo,
      orderBy, // Kolom untuk mengurutkan
      orderDirection, // Arah urutan (ASC atau DESC)
    } = query;

    const filter: {
      [key: string]: any;
    } = {};

    if (nama_produk) {
      filter.nama_produk = Like(`%${nama_produk}%`);
    }
    if (kategori_produk) {
      filter.kategori_produk = kategori_produk;
    }
    if (harga_produk) {
      filter.harga_produk = harga_produk;
    }

    if (jumlah_produkFrom !== undefined && jumlah_produkTo !== undefined) {
      if (jumlah_produkFrom <= jumlah_produkTo) {
        filter.jumlah_produk = Between(jumlah_produkFrom, jumlah_produkTo);
      } else {
        filter.jumlah_produk = Between(jumlah_produkTo, jumlah_produkFrom);
      }
    }

    if (tahun_pembuatanFrom !== undefined && tahun_pembuatanTo !== undefined) {
      if (tahun_pembuatanFrom <= tahun_pembuatanTo) {
        filter.tahun_pembuatan = Between(
          tahun_pembuatanFrom,
          tahun_pembuatanTo,
        );
      } else {
        filter.tahun_pembuatan = Between(
          tahun_pembuatanTo,
          tahun_pembuatanFrom,
        );
      }
    }

    if (created_dateFrom !== undefined && created_dateTo !== undefined) {
      if (created_dateFrom <= created_dateTo) {
        filter.created_date = Between(created_dateFrom, created_dateTo);
      } else {
        filter.created_date = Between(created_dateTo, created_dateFrom);
      }
    }

    const total = await this.produkRepository.count();

    const order: OrderByCondition = {};
    if (orderBy && orderDirection) {
      order[orderBy] = orderDirection.toUpperCase() as 'ASC' | 'DESC'; // Cast ke tipe yang sesuai
    }

    const result = await this.produkRepository.find({
      where: filter,
      order: order,
      skip: limit,
      take: pageSize,
    });

    return this._pagination('OK', result, total, page, pageSize);
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const detailProduk = await this.produkRepository.findOne({
      where: {
        id,
      },
    });

    if (!detailProduk) {
      throw new NotFoundException(`Produk dengan id ${id} tidak ditemukan`);
    }

    return {
      status: 'Success',
      message: 'Detail Produk ditemukan',
      data: detailProduk,
    };
  }

  async createProduk(
    createProdukDto: CreateProdukDto,
  ): Promise<ResponseSuccess> {
    const {
      nama_produk,
      kategori_produk,
      harga_produk,
      jumlah_produk,
      deskripsi_produk,
      tahun_pembuatan,
    } = createProdukDto;

    try {
      await this.produkRepository.save({
        nama_produk,
        kategori_produk,
        harga_produk,
        jumlah_produk,
        deskripsi_produk,
        tahun_pembuatan,
      });
      return {
        status: 'Success',
        message: 'Berhasil menyimpan data',
      };
    } catch (err) {
      throw new HttpException('Ada kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async updateProduk(
    id: number,
    updateProdukDto: UpdateProdukDto,
  ): Promise<ResponseSuccess> {
    const check = await this.produkRepository.findOne({
      where: {
        id,
      },
    });
    if (!check)
      throw new NotFoundException(`Produk dengan id ${id} tidak ditemukan`);

    const update = await this.produkRepository.save({
      ...updateProdukDto,
      id: id,
    });
    return {
      status: `Success `,
      message: 'berhasil memperbaharui data',
      data: update,
    };
  }

  async deleteProduk(id: number): Promise<ResponseSuccess> {
    const check = await this.produkRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Produk dengan id ${id} tidak ditemukan`);

    await this.produkRepository.delete(id);

    return {
      status: 'Success',
      message: 'Berhasil menghapus produk',
    };
  }

  async bulkCreate(payload: createProdukArrayDto): Promise<ResponseSuccess> {
    try {
      console.log('pay', payload);
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {
            await this.produkRepository.save(item);
            berhasil = berhasil + 1;
          } catch {
            gagal = gagal + 1;
          }
        }),
      );

      return {
        status: 'ok',
        message: `Berhasil menambahkan produk sebanyak ${berhasil} dan gagal ${gagal}`,
        data: payload,
      };
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async bulkDelete(ids: number[]): Promise<ResponseSuccess> {
    // Menyaring ID yang tidak valid (null atau NaN)
    const idProdukValid = ids.filter((id) => id !== null && !isNaN(id));

    // Mengecek apakah masih ada ID yang valid
    if (idProdukValid.length === 0) {
      throw new HttpException('ID produk tidak valid', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.produkRepository.delete(idProdukValid);
      return {
        status: 'ok',
        message: `Berhasil Menghapus ${result.affected} produk`,
        data: result,
      };
    } catch (error) {
      console.error('Error during bulk delete:', error);
      throw new HttpException(
        'Ada Kesalahan saat penghapusan produk',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
