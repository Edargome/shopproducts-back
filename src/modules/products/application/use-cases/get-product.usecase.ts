import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { ProductNotFoundError } from '../../domain/errors/product.errors';
import { Product } from '../../domain/entities/product.entity';

export class GetProductUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}

  async execute(id: string): Promise<Product> {
    const product = await this.repo.findById(id);
    if (!product) throw new ProductNotFoundError();
    return product;
  }
}
