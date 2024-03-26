// // create-produk.dto.ts
// import {
//   IsString,
//   IsNumber,
//   MinLength,
//   IsEnum,
//   Min,
//   Max,
//   IsOptional,
//   IsIn,
//   IsDateString,
//   IsArray,
//   IsNotEmpty,
//   ValidateNested,
//   ArrayNotEmpty,
// } from 'class-validator';
// import { KategoriProduk } from './produk.entity';
// import { PickType } from '@nestjs/mapped-types';
// import { Type } from 'class-transformer';

// export class CreateProdukDto {
//   @IsString()
//   @MinLength(5)
//   nama_produk: string;

//   @IsEnum(KategoriProduk)
//   kategori_produk: KategoriProduk;

//   @IsNumber()
//   @Min(10000)
//   harga_produk: number;

//   @IsNumber()
//   @Min(10)
//   jumlah_produk: number;

//   @IsString()
//   deskripsi_produk: string;

//   @IsNumber()
//   @Min(2010)
//   @Max(2023)
//   tahun_pembuatan: number;
// }

// export class UpdateProdukDto extends PickType(CreateProdukDto, [
//   'nama_produk',
//   'kategori_produk',
//   'harga_produk',
//   'jumlah_produk',
//   'deskripsi_produk',
//   'tahun_pembuatan',
// ]) {}

// export class createProdukArrayDto {
//   @IsArray()
//   @ValidateNested()
//   @Type(() => CreateProdukDto)
//   data: CreateProdukDto[];
// }
// export class DeleteProdukArrayDto {
//   @IsArray()
//   @IsNumber({}, { each: true })
//   data: number[];
// }

// export class FindProdukDto {
//   @IsOptional()
//   @IsString()
//   nama_produk?: string;

//   @IsOptional()
//   @IsEnum(KategoriProduk)
//   kategori_produk?: KategoriProduk;

//   @IsOptional()
//   @IsNumber()
//   harga_produk?: number;

//   @IsOptional()
//   @IsNumber()
//   jumlah_produkFrom?: number;

//   @IsOptional()
//   @IsNumber()
//   jumlah_produkTo?: number;

//   @IsOptional()
//   @IsNumber()
//   @Min(2010)
//   tahun_pembuatanFrom?: number;

//   @IsOptional()
//   @IsNumber()
//   @Max(2023)
//   tahun_pembuatanTo?: number;

//   @IsOptional()
//   @IsDateString()
//   created_dateFrom?: Date;

//   @IsOptional()
//   @IsDateString()
//   created_dateTo?: Date;

//   @IsOptional()
//   @IsString()
//   @IsIn(['ASC', 'DESC'])
//   orderDirection?: 'ASC' | 'DESC';

//   @IsOptional()
//   @IsString()
//   @IsIn([
//     'nama_produk',
//     'kategori_produk',
//     'harga_produk',
//     'jumlah_produk',
//     'tahun_pembuatan',
//     'created_date',
//   ])
//   orderBy?: string;

//   @IsOptional()
//   @IsNumber()
//   page?: number;

//   @IsOptional()
//   @IsNumber()
//   pageSize?: number;

//   @IsOptional()
//   @IsNumber()
//   limit?: number;
// }
