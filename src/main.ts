import { NestFactory } from '@nestjs/core';
import { ValidationPipe} from '@nestjs/common';
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
  app.enableCors({
    origin: 'http://localhost:4200',
  });
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
bootstrap();
