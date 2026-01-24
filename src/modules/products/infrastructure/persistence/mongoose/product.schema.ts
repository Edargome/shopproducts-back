import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<ProductMongo>;

@Schema({ timestamps: true, collection: 'products' })
export class ProductMongo {
  @Prop({ required: true, unique: true, index: true })
  sku!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, min: 0 })
  stock!: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ProductSchema = SchemaFactory.createForClass(ProductMongo);
ProductSchema.index({ sku: 'text', name: 'text', description: 'text' });
