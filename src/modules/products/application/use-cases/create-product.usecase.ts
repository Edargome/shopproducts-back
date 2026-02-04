import { Product } from '../../domain/entities/product.entity';
import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { SkuAlreadyExistsError } from '../../domain/errors/product.errors';
import { CreateProductCommand } from '../dto/create-product.command';
import { Actor } from '../../../../common/auth/actor';
import { requireAdmin } from '../../../../common/auth/authorization';

export class CreateProductUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}

  async execute(actor: Actor, cmd: CreateProductCommand): Promise<Product> {
    requireAdmin(actor);

    const existing = await this.repo.findBySku(cmd.sku.trim());
    if (existing) throw new SkuAlreadyExistsError();

    const product = Product.createNew({
      sku: cmd.sku,
      name: cmd.name,
      description: cmd.description,
      price: cmd.price,
      stock: cmd.stock,
    });

    product.validate();
    return this.repo.create(product);
  }
}
