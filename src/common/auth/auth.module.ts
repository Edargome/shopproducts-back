// src/common/auth/auth.module.ts
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';

// 👇 Importa el tipo correcto
import type { StringValue } from 'ms';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) throw new Error('JWT_SECRET is missing in .env');

        // 👇 Tipado explícito para que TS no lo deje como "string"
        const expiresIn =
          (config.get<string>('JWT_EXPIRES_IN') as StringValue | undefined) ?? ('1h' as StringValue);

        return {
          secret,
          signOptions: { expiresIn }, // ✅ ahora coincide con JwtModuleOptions
        };
      },
    }),
  ],
  providers: [JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthCommonModule {}
