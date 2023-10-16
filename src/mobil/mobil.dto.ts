import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  ValidateNested,
  IsOptional,
  IsString,
  IsIn,
  ValidateIf,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class MobilDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  nama: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['honda', 'toyota', 'suzuki'])
  merekMobil: string;

  @IsNotEmpty()
  tipeMobil: string;

  @IsInt()
  @Min(150000000)
  @Max(400000000)
  harga: number;

  @IsInt()
  @Min(2017)
  @Max(2023)
  tahun: number;

  // @ValidateIf((o) => o.merekMobil === 'honda')
  // @IsIn(['CRV', 'BRV', 'HRV'])
  // hondaType: string;

  // @ValidateIf((o) => o.merekMobil === 'toyota')
  // @IsIn(['Avanza', 'Innova', 'Raize'])
  // toyotaType: string;

  // @ValidateIf((o) => o.merekMobil === 'suzuki')
  // @IsIn(['Ertiga', 'XL7', 'baleno'])
  // suzukiType: string;
}

export class CreateMobilDto extends OmitType(MobilDto, ['id']) {}
export class UpdateMobilDto extends PickType(MobilDto, [
  'nama',
  'merekMobil',
  'tipeMobil',
  'harga',
  'tahun',
]) {}

export class CreateMobilArrayDto {
  @IsArray()
  @ValidateNested()
  @Type(() => MobilDto)
  data: MobilDto[];
}

export class FindMobilDto extends PageRequestDto {
  @IsOptional()
  nama: string;

  @IsOptional()
  merekMobil: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  from_tahun: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  to_tahun: number;
}
