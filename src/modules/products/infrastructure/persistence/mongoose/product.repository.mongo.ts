import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductMongo } from './product.schema';
import { Product } from '../../../domain/entities/product.entity';
import { ListProductsQuery, ProductRepositoryPort } from '../../../domain/ports/product.repository.port';
import { ProductMapper } from './product.mapper';

export class ProductMongoRepository implements ProductRepositoryPort {
  constructor(
    @InjectModel(ProductMongo.name) private readonly model: Model<ProductMongo>,
  ) { }

  async create(product: Product): Promise<Product> {
    const created = await this.model.create({
      sku: product.sku,
      name: product.name,
      description: product.description ?? undefined,
      price: product.price,
      stock: product.stock,
    });
    return ProductMapper.toDomain(created as any);
  }

  async findById(id: string): Promise<Product | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model.findById(id).exec();
    return doc ? ProductMapper.toDomain(doc as any) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const doc = await this.model.findOne({ sku }).exec();
    return doc ? ProductMapper.toDomain(doc as any) : null;
  }

  async list(query: ListProductsQuery): Promise<{ items: Product[]; nextCursor?: string }> {
    const limit = Math.min(Math.max(query.limit, 1), 50);

    const filter: any = {};
    if (query.cursor && Types.ObjectId.isValid(query.cursor)) {
      filter._id = { $gt: new Types.ObjectId(query.cursor) };
    }

    const docs = await this.model
      .find(filter)
      .sort({ _id: 1 })
      .limit(limit + 1)
      .lean(false)
      .exec();

    const items = docs.slice(0, limit).map((d: any) => ProductMapper.toDomain(d));
    const next = docs.length > limit ? docs[limit]._id.toString() : undefined;

    return { items, nextCursor: next };
  }

  async update(product: Product): Promise<Product> {
    const doc = await this.model.findByIdAndUpdate(
      product.id,
      {
        $set: {
          name: product.name,
          description: product.description ?? undefined,
          price: product.price,
          updatedAt: new Date(),
        },
      },
      { new: true },
    ).exec();

    // si desaparece, devuelves null en otro diseño; acá asumimos existe
    return ProductMapper.toDomain(doc as any);
  }

  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;
    await this.model.deleteOne({ _id: new Types.ObjectId(id) }).exec();
  }

  async decrementStockAtomic(productId: string, qty: number) {
    if (!Types.ObjectId.isValid(productId)) return null;

    const doc = await this.model.findOneAndUpdate(
      { _id: new Types.ObjectId(productId), stock: { $gte: qty } },
      { $inc: { stock: -qty }, $set: { updatedAt: new Date() } },
      { new: true },
    ).exec();

    return doc ? ProductMapper.toDomain(doc as any) : null;
  }

  async existsById(productId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(productId)) return false;
    const exists = await this.model.exists({ _id: new Types.ObjectId(productId) });
    return !!exists;
  }

  // set stock absoluto (stock ya viene >= 0 validado por DTO)
  async setStock(productId: string, stock: number) {
    if (!Types.ObjectId.isValid(productId)) return null;

    const doc = await this.model.findByIdAndUpdate(
      new Types.ObjectId(productId),
      { $set: { stock, updatedAt: new Date() } },
      { new: true },
    ).exec();

    return doc ? ProductMapper.toDomain(doc as any) : null;
  }

  // delta (puede ser negativo), pero NO dejamos que el final sea < 0
  async adjustStockByDelta(productId: string, delta: number) {
    if (!Types.ObjectId.isValid(productId)) return null;

    const doc = await this.model.findOneAndUpdate(
      {
        _id: new Types.ObjectId(productId),
        stock: { $gte: -delta }, // si delta=-3 => stock >= 3
      },
      { $inc: { stock: delta }, $set: { updatedAt: new Date() } },
      { new: true },
    ).exec();

    return doc ? ProductMapper.toDomain(doc as any) : null;
  }
}
