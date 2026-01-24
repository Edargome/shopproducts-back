import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseFilters } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from './dto/pagination.dto';
import { CreateProductUseCase } from '../../application/use-cases/create-product.usecase';
import { GetProductUseCase } from '../../application/use-cases/get-product.usecase';
import { ListProductsUseCase } from '../../application/use-cases/list-products.usecase';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.usecase';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.usecase';
import { CreateProductCommand } from '../../application/dto/create-product.command';
import { UpdateProductCommand } from '../../application/dto/update-product.command';
import { ProductsExceptionsFilter } from './filters/product-exceptions.filter';
import { DecrementStockUseCase } from '../../application/use-cases/decrement-stock.usecase';
import { DecrementStockDto } from './dto/decrement-stock.dto';
import { AdjustStockUseCase } from '../../application/use-cases/adjust-stock.usecase';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@UseFilters(ProductsExceptionsFilter)
@Controller('products')
export class ProductsController {
  constructor(
    private readonly createUC: CreateProductUseCase,
    private readonly getUC: GetProductUseCase,
    private readonly listUC: ListProductsUseCase,
    private readonly updateUC: UpdateProductUseCase,
    private readonly deleteUC: DeleteProductUseCase,
    private readonly decStockUC: DecrementStockUseCase,
    private readonly adjustStockUC: AdjustStockUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.createUC.execute(
      new CreateProductCommand(
        dto.sku,
        dto.name,
        dto.description ?? null,
        dto.price,
        dto.stock,
      ),
    );
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.getUC.execute(id);
  }

  @Get()
  list(@Query() q: PaginationQueryDto) {
    return this.listUC.execute({ limit: q.limit, cursor: q.cursor });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.updateUC.execute(
      new UpdateProductCommand(id, dto.name, dto.description, dto.price),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUC.execute(id);
  }

  @Post(':id/decrement-stock')
  decrementStock(@Param('id') id: string, @Body() dto: DecrementStockDto) {
    return this.decStockUC.execute({ productId: id, qty: dto.qty });
  }

  @Post(':id/adjust-stock')
  adjustStock(@Param('id') id: string, @Body() dto: AdjustStockDto) {
    return this.adjustStockUC.execute({
      productId: id,
      stock: dto.stock,
      delta: dto.delta,
    });
  }
}
