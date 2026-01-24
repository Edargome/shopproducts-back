import { Product } from '../entities/product.entity';

export type ListProductsQuery = {
  limit: number;
  cursor?: string;
};

export interface ProductRepositoryPort {
  create(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  list(query: ListProductsQuery): Promise<{ items: Product[]; nextCursor?: string }>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  decrementStockAtomic(productId: string, qty: number): Promise<Product | null>;
  existsById(productId: string): Promise<boolean>;
  setStock(productId: string, stock: number): Promise<Product | null>;
  adjustStockByDelta(productId: string, delta: number): Promise<Product | null>;
}
