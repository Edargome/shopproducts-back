import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';

export class ListProductsUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}

  async execute(params: { limit: number; cursor?: string }) {
    return this.repo.list({ limit: params.limit, cursor: params.cursor });
  }
}
