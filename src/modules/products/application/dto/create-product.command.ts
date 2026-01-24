export class CreateProductCommand {
  constructor(
    public readonly sku: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly price: number,
    public readonly stock: number,
  ) {}
}
