import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { InsufficientStockError, ProductNotFoundError } from '../../domain/errors/product.errors';
import { Actor } from '../../../../common/auth/actor';

export class PurchaseProductUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}

  async execute(actor: Actor, params: { productId: string; qty: number }) {
    // actor se usa para auditar en el futuro (buyerId), pero aquí basta con que exista
    if (!actor?.userId) throw new Error('Missing actor');

    const updated = await this.repo.decrementStockAtomic(params.productId, params.qty);
    if (updated) return updated;

    const exists = await this.repo.existsById(params.productId);
    if (!exists) throw new ProductNotFoundError();

    throw new InsufficientStockError();
  }
}
