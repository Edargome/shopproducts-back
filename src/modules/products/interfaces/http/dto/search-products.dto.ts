import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class SearchProductsQueryDto {
  @IsString()
  q!: string;

  @IsInt()
  @Min(1)
  @Max(50)
  @Transform(({ value }) => Number(value))
  limit: number = 20;

  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  page: number = 1;
}
