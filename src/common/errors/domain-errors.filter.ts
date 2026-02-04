import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch() // 👈 OJO: Catch sin argumento, captura todo
export class DomainErrorsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    // ✅ 1) Si es una excepción HTTP de Nest, respóndela tal cual (NO convertir a 500)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      console.log('[HttpException passthrough]', { status, body });

      return res.status(status).json(
        typeof body === 'string'
          ? { statusCode: status, message: body }
          : body
      );
    }

    // ✅ 2) Errores de dominio (o errores genéricos)
    const err = exception as any;
    const type = err?.constructor?.name ?? err?.name ?? 'Unknown';

    console.log('[DomainErrorsFilter]', {
      type,
      name: err?.name,
      message: err?.message,
    });

    switch (type) {
      // ---- PRODUCTS
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

      // ---- USERS / AUTH
      case 'UserNotFoundError':
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: err.message,
          error: 'Not Found',
        });

      case 'UserAlreadyExistsError':
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: 409,
          message: err.message,
          error: 'Conflict',
        });

      case 'InvalidCredentialsError':
        return res.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: 401,
          message: err.message,
          error: 'Unauthorized',
        });

      // ---- COMMON
      case 'ForbiddenError':
        return res.status(HttpStatus.FORBIDDEN).json({
          statusCode: 403,
          message: err.message,
          error: 'Forbidden',
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
