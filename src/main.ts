import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainErrorsFilter } from './common/filters/domain-errors.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new DomainErrorsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SmartInventory API')
    .setDescription('API para gestión de productos, autenticación y compra (stock).')
    .setVersion('1.0.0')
    // 👇 nombre del esquema: "access-token" (úsalo en @ApiBearerAuth)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Pega aquí tu JWT. Ej: Bearer <token>',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // ✅ mantiene el token entre refresh
    },
  });
  app.enableCors({
    origin: 'http://localhost:4200',
  });
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
bootstrap();
