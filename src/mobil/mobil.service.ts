import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { CreateMobilDto, FindMobilDto, CreateMobilArrayDto } from './mobil.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PembelianMobil } from './mobil.entity';
import { Between, Like, Repository } from 'typeorm';
import { UpdateMobilDto } from './mobil.dto';

@Injectable()
export class MobilService {
  constructor(
    @InjectRepository(PembelianMobil)
    private readonly mobilRepository: Repository<PembelianMobil>,
  ) {}

  async getAllMobil(findMobilDto: FindMobilDto): Promise<ResponsePagination> {
    const {
      page,
      pageSize,
      limit,
      merekMobil,
      // tipeMobil,
      from_tahun,
      to_tahun,
    } = findMobilDto;

    const filter: {
      [key: string]: any;
    } = {};

    if (merekMobil) {
      filter.merekMobil = Like(`%${merekMobil}%`);
    }

    // if (tipeMobil) {
    //   filter.tipeMobil = Like(`%${tipeMobil}%`);c
    // }

    if (from_tahun && to_tahun) {
      filter.tahun = Between(from_tahun, to_tahun);
    }

    if (from_tahun && !to_tahun) {
      filter.tahun = Between(from_tahun, from_tahun);
    }

    const result = await this.mobilRepository.find({
      where: filter,
      skip: limit,
      take: pageSize,
    });

    const total = await this.mobilRepository.count({
      where: filter,
    });

    return {
      status: 'Success',
      message: 'List Mobil ditemukan',
      data: result,
      pagination: {
        total: total,
        page: page,
        pageSize: pageSize,
      },
    };
  }

  async createMobil(createMobilDto: CreateMobilDto): Promise<ResponseSuccess> {
    const { nama, merekMobil, tipeMobil, harga, tahun } = createMobilDto;

    try {
      await this.mobilRepository.save({
        nama: nama,
        merekMobil: merekMobil,
        tipeMobil: tipeMobil,
        harga: harga,
        tahun: tahun,
      });
      return {
        status: 'Success',
        message: 'Berhasil menambahkan mobil',
      };
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const detailMobil = await this.mobilRepository.findOne({
      where: { id },
    });

    if (!detailMobil) {
      throw new NotFoundException(`Mobil dengan id ${id} tidak ditemukan`);
    }
    return {
      status: 'Success',
      message: 'Detail Mobil ditemukan',
      data: detailMobil,
    };
  }

  async updateMobil(
    id: number,
    updateMobilDto: UpdateMobilDto,
  ): Promise<ResponseSuccess> {
    const check = await this.mobilRepository.findOne({
      where: {
        id,
      },
    });

    if (!check) {
      throw new NotFoundException(`Mobil dengan id ${id} tidak ditemukan`);
    }

    const update = await this.mobilRepository.save({
      ...updateMobilDto,
      id: id,
    });
    return {
      status: `Success`,
      message: 'Mobil berhasil diupdate',
      data: update,
    };
  }

  async deleteMobil(id: number): Promise<ResponseSuccess> {
    const check = await this.mobilRepository.findOne({
      where: {
        id,
      },
    });

    if (!check) {
      throw new NotFoundException(`Mobil dengan id ${id} tidak ditemukan`);
    }

    await this.mobilRepository.delete(id);
    return {
      status: `Success`,
      message: 'Berhasil menghapus mobil',
    };
  }

  async bulkCreate(payload: CreateMobilArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {
            await this.mobilRepository.save(item);
            berhasil = berhasil + 1;
          } catch {
            gagal = gagal + 1;
          }
        }),
      );

      return {
        status: 'ok',
        message: `Berhasil menambahkan mobil sebanyak ${berhasil} dan gagal sebanyak ${gagal}`,
        data: payload,
      };
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async bulkDelete(ids: number[]): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        ids.map(async (id) => {
          try {
            const mobilToDelete = await this.mobilRepository.findOne({
              where: {
                id,
              },
            });

            if (!mobilToDelete) {
              throw new NotFoundException(
                `Mobil dengan ID ${id} tidak ditemukan.`,
              );
            }

            await this.mobilRepository.remove(mobilToDelete);
            berhasil = berhasil + 1;
          } catch {
            gagal = gagal + 1;
          }
        }),
      );

      return {
        status: 'ok',
        message: `Berhasil menghapus mobil sebanyak ${berhasil} dan gagal sebanyak ${gagal}`,
      };
    } catch (error) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
