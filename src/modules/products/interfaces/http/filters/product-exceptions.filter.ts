import { ArgumentsHost, Catch, ExceptionFilter, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InsufficientStockError, ProductNotFoundError, SkuAlreadyExistsError, StockWouldBeNegativeError } from '../../../domain/errors/product.errors';

@Catch(ProductNotFoundError, SkuAlreadyExistsError)
export class ProductsExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof ProductNotFoundError) {
      throw new NotFoundException(exception.message);
    }

    if (exception instanceof SkuAlreadyExistsError) {
      throw new ConflictException(exception.message);
    }

    if (exception instanceof InsufficientStockError) {
      throw new ConflictException(exception.message);
    }

    if (exception instanceof StockWouldBeNegativeError) {
      throw new ConflictException(exception.message);
    }

    if (exception instanceof Error && exception.message.startsWith('Provide either')) {
      throw new BadRequestException(exception.message);
    }
    
    throw exception;
  }
}
