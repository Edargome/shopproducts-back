import { IsInt, Min } from 'class-validator';

export class DecrementStockDto {
  @IsInt()
  @Min(1)
  qty!: number;
}
