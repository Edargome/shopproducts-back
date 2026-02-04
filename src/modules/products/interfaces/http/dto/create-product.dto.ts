import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'SKU-00001' })
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @ApiProperty({ example: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Descripción del producto', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 19.99 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(0)
  stock!: number;
}
