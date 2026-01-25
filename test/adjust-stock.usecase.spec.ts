import { Product } from '../src/modules/products/domain/entities/product.entity';
import { AdjustStockUseCase } from '../src/modules/products/application/use-cases/adjust-stock.usecase';
import {
  ProductNotFoundError,
  StockWouldBeNegativeError,
} from '../src/modules/products/domain/errors/product.errors';
import { ProductRepositoryPort } from '../src/modules/products/domain/ports/product.repository.port';

const productMock = (overrides: Partial<Product> = {}) => {
  const base = new Product(
    '65b2f0a7c3e9a1d2e4f6a8b0',
    'SKU-0001',
    'Producto',
    null,
    100,
    10,
    new Date(),
    new Date(),
  );

  Object.assign(base, overrides);
  return base;
};

describe('AdjustStockUseCase (unit)', () => {
  let repo: jest.Mocked<ProductRepositoryPort>;
  let useCase: AdjustStockUseCase;

  beforeEach(() => {
    repo = {
      setStock: jest.fn(),
      adjustStockByDelta: jest.fn(),
      existsById: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findBySku: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    useCase = new AdjustStockUseCase(repo);
  });

  it('debe fallar si envían stock y delta (input inválido) y NO llamar al repo', async () => {
    await expect(
      useCase.execute({
        productId: '65b2f0a7c3e9a1d2e4f6a8b0',
        stock: 5,
        delta: 1,
      }),
    ).rejects.toThrow('Provide either "stock" or "delta"');

    expect(repo.setStock).not.toHaveBeenCalled();
    expect(repo.adjustStockByDelta).not.toHaveBeenCalled();
    expect(repo.existsById).not.toHaveBeenCalled();
  });

  it('si ajusto por stock absoluto y el producto existe, devuelve el producto actualizado', async () => {
    const updated = productMock({ stock: 9 });
    repo.setStock.mockResolvedValue(updated);

    const result = await useCase.execute({
      productId: updated.id,
      stock: 9,
    });

    expect(result.stock).toBe(9);
    expect(repo.setStock).toHaveBeenCalledWith(updated.id, 9);
    expect(repo.adjustStockByDelta).not.toHaveBeenCalled();
    expect(repo.existsById).not.toHaveBeenCalled();
  });

  it('si ajusto por delta y el repo devuelve null, y el producto NO existe -> ProductNotFoundError', async () => {
    const id = '65b2f0a7c3e9a1d2e4f6a8b0';
    repo.adjustStockByDelta.mockResolvedValue(null);
    repo.existsById.mockResolvedValue(false);

    await expect(
      useCase.execute({ productId: id, delta: -3 }),
    ).rejects.toBeInstanceOf(ProductNotFoundError);

    expect(repo.adjustStockByDelta).toHaveBeenCalledWith(id, -3);
    expect(repo.existsById).toHaveBeenCalledWith(id);
  });

  it('si ajusto por delta y el repo devuelve null, pero el producto existe -> StockWouldBeNegativeError', async () => {
    const id = '65b2f0a7c3e9a1d2e4f6a8b0';
    repo.adjustStockByDelta.mockResolvedValue(null);
    repo.existsById.mockResolvedValue(true);

    await expect(
      useCase.execute({ productId: id, delta: -999 }),
    ).rejects.toBeInstanceOf(StockWouldBeNegativeError);

    expect(repo.adjustStockByDelta).toHaveBeenCalledWith(id, -999);
    expect(repo.existsById).toHaveBeenCalledWith(id);
  });
});
