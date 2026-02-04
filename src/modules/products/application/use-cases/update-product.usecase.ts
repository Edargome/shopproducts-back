import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { ProductNotFoundError } from '../../domain/errors/product.errors';
import { UpdateProductCommand } from '../dto/update-product.command';
import { Actor } from '../../../../common/auth/actor';
import { requireAdmin } from '../../../../common/auth/authorization';

export class UpdateProductUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}

  async execute(actor: Actor, cmd: UpdateProductCommand) {
    requireAdmin(actor);

    const product = await this.repo.findById(cmd.id);
    if (!product) throw new ProductNotFoundError();

    if (typeof cmd.name === 'string') product.name = cmd.name.trim();
    if (cmd.description !== undefined) product.description = cmd.description?.trim() ?? null;
    if (typeof cmd.price === 'number') product.price = cmd.price;

    product.updatedAt = new Date();
    product.validate();

    return this.repo.update(product);
  }
}
