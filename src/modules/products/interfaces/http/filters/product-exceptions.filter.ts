import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ForbiddenError } from '../../../../../common/errors/forbidden.error';

@Catch()
export class ProductsExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    // ✅ 1) Si es un HttpException de Nest (400/401/etc), se devuelve tal cual
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      return res.status(status).json(
        typeof body === 'string' ? { statusCode: status, message: body } : body,
      );
    }

    // ✅ 2) ForbiddenError (role) => 403
    if (exception instanceof ForbiddenError) {
      return res.status(HttpStatus.FORBIDDEN).json({
        statusCode: 403,
        message: exception.message,
        error: 'Forbidden',
      });
    }

    const err = exception as any;
    const type = err?.constructor?.name ?? err?.name ?? 'Unknown';

    // ✅ 3) Errores del dominio de products (ajusta a tus nombres reales)
    switch (type) {
      case 'ProductNotFoundError':
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: err.message,
          error: 'Not Found',
        });

      case 'SkuAlreadyExistsError':
      case 'InsufficientStockError':
      case 'StockWouldBeNegativeError':
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: 409,
          message: err.message,
          error: 'Conflict',
        });

      default:
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: 500,
          message: err?.message ?? 'Internal server error',
          error: 'Internal Server Error',
        });
    }
  }
}
