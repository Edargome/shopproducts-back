# SmartInventory Pro - Backend (NestJS + MongoDB Atlas)

API de backend para la prueba técnica de SmartInventory. Implementa la gestión de productos con arquitectura hexagonal (Dominio/Aplicación/Infraestructura/Presentación) y operaciones de inventario con seguridad de concurrencia.

## Stack Técnico
- Node.js (LTS recomendada)
- NestJS
- MongoDB Atlas (Mongoose via @nestjs/mongoose)
- class-validator / class-transformer
- Jest

## Requisitos
- Node.js 20+ recommended
- MongoDB Atlas connection string (see environment variables)

## Variable de entorno
Crear un archivo `.env` en la **raíz del proyecto** (al mismo nivel de `package.json`):

```bash
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority&appName=Cluster0
```

> Por serguridad: no se incluye `.env` dentro de git.

## Instalar & ejecutar
```bash
npm install
npm run start:dev
```

API starts on:
- `http://localhost:3000` (default)
- Port can be changed with `PORT`.

## Endpoints principales (Products)
Ruta base: `/products`

- `POST /products` - Crear
- `GET /products` - Lista (soporta paginación `page` & `limit`)
- `GET /products/:id` - Obtiene un elemento por ID
- `PATCH /products/:id` - Actualiza
- `GET /products/search?q=...&page=1&limit=20` - Busca por los campos indexados (sku / description / _id indexed)
- `POST /products/:id/adjust-stock` - Ajusta stock (delta can be negative)
- `POST /products/:id/decrement-stock` - Disminuye stock (qty >= 1) con protección de concurrencia.
## Manejo de errores
Los errores de dominio se traducen a códigos HTTP mediante un filtro global:
- `ProductNotFoundError` -> 404
- `SkuAlreadyExistsError` -> 409
- `InsufficientStockError` -> 409
- `StockWouldBeNegativeError` -> 409

## Estrategia de concurrencía
La reducción de stock utiliza una actualización atómica (o una protección equivalente) para evitar que las solicitudes simultáneas sobrevendan el inventario. Cuando el stock es insuficiente, la API devuelve el error `409 Conflict`.

## Pruebas
Ejecutar pruebas:
```bash
npm test
```

### Última prueba ejecutada (proporcionada)
```
> shoppoducts@0.0.1 test
> jest

 PASS  test/adjust-stock.usecase.spec.ts
 PASS  src/app.controller.spec.ts
(node:16184) [MONGOOSE] Warning: Duplicate schema index on {"sku":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
(Use `node --trace-warnings ...` to show where the warning was created)
 PASS  test/products.concurrency.spec.ts (8.551 s)
  ● Console

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)

    console.log
      [DomainErrorsFilter] {
        type: 'InsufficientStockError',
        name: 'Error',
        message: 'Insufficient stock available'
      }

      at DomainErrorsFilter.catch (src/common/filters/domain-errors.filter.ts:12:13)


Test Suites: 3 passed, 3 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        9.181 s, estimated 16 s
Ran all test suites.
PS C:\Users\edwin\Desktop\shoppoducts>
```

## Notas / Advertencia conocida
Si ve:
> Índice de esquema duplicado en { "sku": 1 }
Elimine las declaraciones de índice duplicadas (mantenga `index: true` en el campo de esquema o `schema.index()`, pero no ambos).
