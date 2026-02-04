import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DomainErrorsFilter } from './common/filters/domain-errors.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { AuthCommonModule } from './common/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    AuthCommonModule, // ✅ JWT global + JwtAuthGuard provider

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),

    UsersModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: DomainErrorsFilter },
  ],
})
export class AppModule {}
