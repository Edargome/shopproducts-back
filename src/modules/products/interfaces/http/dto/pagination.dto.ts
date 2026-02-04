import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ example: 20, minimum: 1, maximum: 50 })
  @IsInt()
  @Min(1)
  @Max(50)
  @Transform(({ value }) => Number(value))
  limit: number = 20;

  @ApiProperty({ example: 'cursor123', required: false })
  @IsOptional()
  @IsString()
  cursor?: string;
}
