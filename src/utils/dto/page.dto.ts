import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

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
}
