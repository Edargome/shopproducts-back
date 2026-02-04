# ShopProduct - Backend (NestJS + MongoDB Atlas)

API de backend para la prueba técnica de ShopProduct. Implementa la gestión de productos con arquitectura hexagonal (Dominio/Aplicación/Infraestructura/Presentación) y operaciones de inventario con seguridad de concurrencia.

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

## Swagger
Ruta base: `http://localhost:3000/docs`

## Datos semilla
Se puede inicializar datos de prueba para usar la base de datos con los comandos.
```bash
npm run seed:admin
npm run seed:products
```

## Estrategia de concurrencía
La reducción de stock utiliza una actualización atómica (o una protección equivalente) para evitar que las solicitudes simultáneas sobrevendan el inventario. Cuando el stock es insuficiente, la API devuelve el error `409 Conflict`.


## Notas / Advertencia conocida
Si ve:
> Índice de esquema duplicado en { "sku": 1 }
Elimine las declaraciones de índice duplicadas (mantenga `index: true` en el campo de esquema o `schema.index()`, pero no ambos).
