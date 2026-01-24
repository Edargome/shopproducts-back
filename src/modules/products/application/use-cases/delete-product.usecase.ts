import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';

export class DeleteProductUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
