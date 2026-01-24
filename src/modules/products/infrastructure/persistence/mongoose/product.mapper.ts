import { Product } from '../../../domain/entities/product.entity';
import { ProductDocument } from './product.schema';

export class ProductMapper {
  static toDomain(doc: ProductDocument): Product {
    return new Product(
      doc._id.toString(),
      doc.sku,
      doc.name,
      doc.description ?? null,
      doc.price,
      doc.stock,
      doc.updatedAt,
      doc.createdAt,
    );
  }
}
