import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,            // 👈 clave: convierte query params a tipos
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
bootstrap();
