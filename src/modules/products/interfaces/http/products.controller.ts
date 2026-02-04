import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseFilters, UseGuards } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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
import { SearchProductsUseCase } from '../../application/use-cases/search-products.usecase';
import { SearchProductsQueryDto } from './dto/search-products.dto';
import { ListProductsQueryDto } from './dto/list-products.dto';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { PurchaseProductUseCase } from '../../application/use-cases/purchase-product.usecase';
import { PurchaseProductDto } from './dto/purchase-product.dto';

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
    private readonly searchUC: SearchProductsUseCase,
    private readonly purchaseUC: PurchaseProductUseCase,
  ) {}

  // ✅ Público
  @Get('search')
  search(@Query() q: SearchProductsQueryDto) {
    return this.searchUC.execute({ q: q.q, limit: q.limit, page: q.page });
  }

  // ✅ Público
  @Get(':id')
  get(@Param('id') id: string) {
    return this.getUC.execute(id);
  }

  // ✅ Público
  @Get()
  list(@Query() q: ListProductsQueryDto) {
    return this.listUC.execute({ limit: q.limit, page: q.page });
  }

  // 🔒 ADMIN
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateProductDto) {
    return this.createUC.execute(
      req.user,
      new CreateProductCommand(dto.sku, dto.name, dto.description ?? null, dto.price, dto.stock),
    );
  }

  // 🔒 ADMIN
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.updateUC.execute(
      req.user,
      new UpdateProductCommand(id, dto.name, dto.description, dto.price),
    );
  }

  // 🔒 ADMIN
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.deleteUC.execute(req.user, id);
  }

  // 🔒 ADMIN (opcional mantener)
  @UseGuards(JwtAuthGuard)
  @Post(':id/decrement-stock')
  decrementStock(@Req() req: any, @Param('id') id: string, @Body() dto: DecrementStockDto) {
    return this.decStockUC.execute(req.user, { productId: id, qty: dto.qty });
  }

  // 🔒 ADMIN
  @UseGuards(JwtAuthGuard)
  @Post(':id/adjust-stock')
  adjustStock(@Req() req: any, @Param('id') id: string, @Body() dto: AdjustStockDto) {
    return this.adjustStockUC.execute(req.user, {
      productId: id,
      stock: dto.stock,
      delta: dto.delta,
    });
  }

  // 🛒 USER (auth requerido) - “simula compra” y descuenta stock
  @UseGuards(JwtAuthGuard)
  @Post(':id/purchase')
  purchase(@Req() req: any, @Param('id') id: string, @Body() dto: PurchaseProductDto) {
    return this.purchaseUC.execute(req.user, { productId: id, qty: dto.qty });
  }
}
