import { Product } from '../entities/product.entity';

export type ListProductsQuery = { limit: number; page: number };

export type SearchProductsQuery = {
  q: string;
  limit: number;
  page: number;
};

export interface ProductRepositoryPort {
  create(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  list(query: ListProductsQuery): Promise<{ items: Product[]; total: number }>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  decrementStockAtomic(productId: string, qty: number): Promise<Product | null>;
  existsById(productId: string): Promise<boolean>;
  setStock(productId: string, stock: number): Promise<Product | null>;
  adjustStockByDelta(productId: string, delta: number): Promise<Product | null>;
  search(query: SearchProductsQuery): Promise<{ items: Product[]; total: number }>;
}
