import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { InsufficientStockError, ProductNotFoundError } from '../../domain/errors/product.errors';

export class DecrementStockUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}

  async execute(params: { productId: string; qty: number }) {
    const updated = await this.repo.decrementStockAtomic(params.productId, params.qty);

    if (updated) return updated;

    const exists = await this.repo.existsById(params.productId);
    if (!exists) throw new ProductNotFoundError();

    throw new InsufficientStockError();
  }
}
