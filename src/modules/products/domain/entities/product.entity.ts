export class Product {
  constructor(
    public readonly id: string,
    public sku: string,
    public name: string,
    public description: string | null,
    public price: number,
    public stock: number,
    public updatedAt: Date,
    public createdAt: Date,
  ) {}

  static createNew(params: {
    sku: string;
    name: string;
    description?: string | null;
    price: number;
    stock: number;
  }): Product {
    const now = new Date();
    return new Product(
      '', // se asigna al persistir
      params.sku.trim(),
      params.name.trim(),
      params.description?.trim() ?? null,
      params.price,
      params.stock,
      now,
      now,
    );
  }

  validate(): void {
    if (!this.sku || this.sku.length < 2) throw new Error('Invalid sku');
    if (!this.name || this.name.length < 2) throw new Error('Invalid name');
    if (this.price < 0) throw new Error('Invalid price');
    if (!Number.isInteger(this.stock) || this.stock < 0) throw new Error('Invalid stock');
  }
}
