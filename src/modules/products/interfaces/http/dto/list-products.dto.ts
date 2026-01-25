import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListProductsQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Transform(({ value }) => Number(value))
  limit: number = 20;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  page: number = 1;
}
