import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, ValidateIf } from 'class-validator';

export class AdjustStockDto {
  // Si viene stock, delta debe ser undefined
  @ApiProperty({ example: 50, minimum: 0, description: 'Nuevo stock absoluto del producto' , required: false})
  @ValidateIf(o => o.delta === undefined)
  @IsInt()
  @Min(0) // ✅ no permite negativos
  stock?: number;

  // Si viene delta, stock debe ser undefined
  @ApiProperty({ example: -10, description: 'Ajuste relativo del stock (puede ser negativo)', required: false })
  @ValidateIf(o => o.stock === undefined)
  @IsInt()
  delta?: number; // ✅ puede ser negativo, pero validaremos que no deje el stock final < 0
}
