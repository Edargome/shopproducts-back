import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';

export class ListProductsUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}

  async execute(params: { limit: number; page: number }) {
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 50);
    const page = Math.max(params.page ?? 1, 1);

    const { items, total } = await this.repo.list({ limit, page });
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }
}