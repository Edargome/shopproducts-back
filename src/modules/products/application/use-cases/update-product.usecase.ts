import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { ProductNotFoundError } from '../../domain/errors/product.errors';
import { UpdateProductCommand } from '../dto/update-product.command';

export class UpdateProductUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}

  async execute(cmd: UpdateProductCommand) {
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
