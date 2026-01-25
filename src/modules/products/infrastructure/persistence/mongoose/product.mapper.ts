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
  };
  static toDomainFromLean(d: any) {
    return new Product(
      d._id.toString(),
      d.sku,
      d.name,
      d.description ?? null,
      d.price,
      d.stock,
      d.updatedAt ?? new Date(),
      d.createdAt ?? new Date(),
    );
  }
}