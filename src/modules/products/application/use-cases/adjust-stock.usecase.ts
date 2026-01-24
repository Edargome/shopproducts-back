import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { ProductNotFoundError, StockWouldBeNegativeError } from '../../domain/errors/product.errors';

export class AdjustStockUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}

  async execute(params: { productId: string; stock?: number; delta?: number }) {
    const hasStock = typeof params.stock === 'number';
    const hasDelta = typeof params.delta === 'number';
    if (hasStock === hasDelta) {
      throw new Error('Provide either "stock" or "delta"');
    }

    if (hasStock) {
      const updated = await this.repo.setStock(params.productId, params.stock!);
      if (!updated) throw new ProductNotFoundError();
      return updated;
    }

    // hasDelta
    const updated = await this.repo.adjustStockByDelta(params.productId, params.delta!);
    if (updated) return updated;

    // si falló: o no existe, o quedaría negativo
    const exists = await this.repo.existsById(params.productId);
    if (!exists) throw new ProductNotFoundError();

    throw new StockWouldBeNegativeError();
  }
}
