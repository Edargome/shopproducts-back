import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListProductsQueryDto {
  @ApiProperty({ example: 'producto' , required: false})
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Transform(({ value }) => Number(value))
  limit: number = 20;

  @ApiProperty({ example: 1 , required: false})
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  page: number = 1;
}
