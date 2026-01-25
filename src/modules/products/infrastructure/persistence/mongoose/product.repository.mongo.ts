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

  async list(query: { limit: number; page: number }) {
    const limit = Math.min(Math.max(Number(query.limit), 1), 50);
    const page = Math.max(Number(query.page), 1);
    const skip = (page - 1) * limit;

    const [total, docs] = await Promise.all([
      this.model.countDocuments({}),
      this.model
        .find({})
        .sort({ _id: -1 }) // más recientes primero
        .skip(skip)
        .limit(limit)
        .select('_id sku name description price stock createdAt updatedAt')
        .lean()
        .exec(),
    ]);

    const items = docs.map((d: any) => ProductMapper.toDomainFromLean(d));
    return { items, total };
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

  async search(query: { q: string; limit: number; page: number }) {
    const limit = Math.min(Math.max(Number(query.limit), 1), 50);
    const page = Math.max(Number(query.page), 1);
    const skip = (page - 1) * limit;

    const filter = { $text: { $search: query.q } };
    const total = await this.model.countDocuments(filter);

    // traer items con score y proyección ligera
    const docs = await this.model
      .find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit)
      .select('_id sku name description price stock updatedAt')
      .lean()
      .exec();

    const items = docs.map((d: any) =>
      new (require('../../../domain/entities/product.entity').Product)(
        d._id.toString(),
        d.sku,
        d.name,
        d.description ?? null,
        d.price,
        d.stock,
        d.updatedAt ?? new Date(),
        d.createdAt ?? new Date(),
      ),
    );

    return { items, total };
  }

}
