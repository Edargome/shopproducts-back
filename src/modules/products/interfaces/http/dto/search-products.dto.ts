import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class SearchProductsQueryDto {
  @ApiProperty({ example: 'producto', description: 'Texto de búsqueda' })
  @IsString()
  q!: string;

  @ApiProperty({ example: 20, minimum: 1, maximum: 50 })
  @IsInt()
  @Min(1)
  @Max(50)
  @Transform(({ value }) => Number(value))
  limit: number = 20;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  page: number = 1;
}
