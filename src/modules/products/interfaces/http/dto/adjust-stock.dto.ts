import { IsInt, IsOptional, Min, ValidateIf } from 'class-validator';

export class AdjustStockDto {
  // Si viene stock, delta debe ser undefined
  @ValidateIf(o => o.delta === undefined)
  @IsInt()
  @Min(0) // ✅ no permite negativos
  stock?: number;

  // Si viene delta, stock debe ser undefined
  @ValidateIf(o => o.stock === undefined)
  @IsInt()
  delta?: number; // ✅ puede ser negativo, pero validaremos que no deje el stock final < 0
}
