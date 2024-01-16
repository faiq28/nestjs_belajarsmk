import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsNotEmpty,
  Length,
  IsInt,
  Min,
  Max,
  ValidateNested,
  IsOptional,
  ArrayNotEmpty,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class BookDto {
  @IsNumber()
  id: number;

  @IsNotEmpty() // title tidak boleh kosong
  @Length(4, 300) // panjang karakter dari title minimal 4 dan maksimal 10
  title: string;

  @IsNotEmpty()
  //   @Length(2, 3)
  author: string;

  @IsInt() // year wajib number
  @Min(2020) // minimal tahun adalah 2020
  @Max(2023) //maksimal tahun adalah 2023
  year: number;
}

export class CreateBookDto extends OmitType(BookDto, ['id']) {}
export class UpdateBookDto extends PickType(BookDto, [
  'title',
  'author',
  'year',
]) {}
//OmitType untuk item yang dikecualikan
//PickType untuk item yang akan diambilx
export class createBookArrayDto {
  @IsArray()
  @ValidateNested()
  @Type(() => CreateBookDto)
  data: CreateBookDto[];
}

export class deleteBookArrayDto {
  @IsArray()
  @ArrayNotEmpty()
  data: [];
}

export class FindBookDto extends PageRequestDto {
  @IsOptional()
  title: string;

  @IsOptional()
  author: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  from_year: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  to_year: number;
}
