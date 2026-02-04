import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { Actor } from '../../../../common/auth/actor';
import { requireAdmin } from '../../../../common/auth/authorization';

export class DeleteProductUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}

  async execute(actor: Actor, id: string): Promise<void> {
    requireAdmin(actor);
    await this.repo.delete(id);
  }
}
