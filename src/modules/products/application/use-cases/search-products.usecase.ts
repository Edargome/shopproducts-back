import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';

export class SearchProductsUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}

  async execute(params: { q: string; limit: number; page: number }) {
    const q = params.q.trim();
    if (!q) return { items: [], total: 0 };

    const { items, total } = await this.repo.search({ q, limit: params.limit, page: params.page });
    const limit = Math.min(Math.max(params.limit, 1), 50);
    const page = Math.max(params.page, 1);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }
}
