import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsNotEmpty,
  Length,
  IsInt,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class UserDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @Length(3, 7)
  nama: string;

  @IsNotEmpty()
  email: string;

  @IsInt()
  @Min(17)
  @Max(45)
  umur: number;

  @IsNotEmpty()
  @Length(2)
  tanggal_lahir: string;

  @IsNotEmpty()
  status: string;
}

export class CreateUserDto extends OmitType(UserDto, ['id']) {}
export class UpdateUserDto extends PickType(UserDto, [
  'nama',
  'email',
  'umur',
  'tanggal_lahir',
  'status',
]) {}

export class createUserArrayDto {
  @IsArray()
  @ValidateNested()
  @Type(() => CreateUserDto)
  data: CreateUserDto[];
}

export class FindUserDto extends PageRequestDto {
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
