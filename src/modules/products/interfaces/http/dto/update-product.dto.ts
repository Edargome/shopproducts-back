import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ example: 'Producto actualizado', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Descripción actualizada', required: false })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ example: 29.99, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
