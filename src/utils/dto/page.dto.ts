import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PageRequestDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page = 1;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  pageSize = 10;

  @IsInt()
  @IsOptional()
  limit;

  @IsString()
  @IsOptional()
  sort_by: string;

  @IsString()
  @IsOptional()
  order_by: string;
}
