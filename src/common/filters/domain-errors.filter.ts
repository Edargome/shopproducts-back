import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class DomainErrorsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    // ✅ DEBUG (déjalo mientras validas)
    const type = exception?.constructor?.name ?? exception?.name ?? 'Unknown';
    console.log('[DomainErrorsFilter]', { type, name: exception.name, message: exception.message });

    switch (type) {
      case 'ProductNotFoundError':
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: exception.message,
          error: 'Not Found',
        });

      case 'SkuAlreadyExistsError':
      case 'InsufficientStockError':
      case 'StockWouldBeNegativeError':
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: 409,
          message: exception.message,
          error: 'Conflict',
        });

      default:
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: 500,
          message: exception.message ?? 'Internal server error',
          error: 'Internal Server Error',
        });
    }
  }
}
