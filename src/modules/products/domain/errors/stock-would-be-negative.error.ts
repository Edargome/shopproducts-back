import { DomainError } from './domain.error';

export class StockWouldBeNegativeError extends DomainError {
  constructor(message = 'Stock would be negative') {
    super(message);
  }
}