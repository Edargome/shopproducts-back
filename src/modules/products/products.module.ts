import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductMongo, ProductSchema } from './infrastructure/persistence/mongoose/product.schema';
import { ProductsController } from './interfaces/http/products.controller';
import { PRODUCT_REPOSITORY } from './tokens';
import { ProductMongoRepository } from './infrastructure/persistence/mongoose/product.repository.mongo';
import { CreateProductUseCase } from './application/use-cases/create-product.usecase';
import { GetProductUseCase } from './application/use-cases/get-product.usecase';
import { ListProductsUseCase } from './application/use-cases/list-products.usecase';
import { UpdateProductUseCase } from './application/use-cases/update-product.usecase';
import { DeleteProductUseCase } from './application/use-cases/delete-product.usecase';
import { DecrementStockUseCase } from './application/use-cases/decrement-stock.usecase';
import { AdjustStockUseCase } from './application/use-cases/adjust-stock.usecase';
import { SearchProductsUseCase } from './application/use-cases/search-products.usecase';
import { PurchaseProductUseCase } from './application/use-cases/purchase-product.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProductMongo.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: ProductMongoRepository },

    // Use Cases (inyección por factory para depender del Port)
    {
      provide: CreateProductUseCase,
      useFactory: (repo) => new CreateProductUseCase(repo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: GetProductUseCase,
      useFactory: (repo) => new GetProductUseCase(repo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: ListProductsUseCase,
      useFactory: (repo) => new ListProductsUseCase(repo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: UpdateProductUseCase,
      useFactory: (repo) => new UpdateProductUseCase(repo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: DeleteProductUseCase,
      useFactory: (repo) => new DeleteProductUseCase(repo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: DecrementStockUseCase,
      useFactory: (repo) => new DecrementStockUseCase(repo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: AdjustStockUseCase,
      useFactory: (repo) => new AdjustStockUseCase(repo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: SearchProductsUseCase,
      useFactory: (repo) => new SearchProductsUseCase(repo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: PurchaseProductUseCase,
      useFactory: (repo) => new PurchaseProductUseCase(repo),
      inject: [PRODUCT_REPOSITORY],
    },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}
