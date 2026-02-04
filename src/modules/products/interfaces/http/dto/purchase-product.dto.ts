import { IsInt, Min } from 'class-validator';

export class PurchaseProductDto {
  @IsInt()
  @Min(1)
  qty!: number;
}
