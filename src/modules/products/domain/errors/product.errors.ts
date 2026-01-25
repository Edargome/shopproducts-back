export class ProductNotFoundError extends Error {
  constructor() {
    super('Product not found in the system');
  }
}

export class SkuAlreadyExistsError extends Error {
  constructor() {
    super('SKU already exists');
  }
}

export class InsufficientStockError extends Error {
  constructor() {
    super('Insufficient stock available');
  }
}

export class StockWouldBeNegativeError extends Error {
  constructor() {
    super('Stock would become negative');
  }
}