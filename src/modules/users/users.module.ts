import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserMongo, UserSchema } from './infrastructure/persistence/mongoose/user.schema';
import { AuthController } from './interfaces/http/auth.controller';
import { USER_REPOSITORY, PASSWORD_HASHER, TOKEN_SERVICE } from './tokens';
import { UserMongoRepository } from './infrastructure/persistence/mongoose/user.repository.mongo';
import { BcryptHasher } from './infrastructure/security/bcrypt.hasher';
import { JwtTokenService } from './infrastructure/security/jwt.token-service';
import { RegisterUserUseCase } from './application/use-cases/register-user.usecase';
import { LoginUseCase } from './application/use-cases/login.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserMongo.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserMongoRepository },
    { provide: PASSWORD_HASHER, useClass: BcryptHasher },

    {
      provide: TOKEN_SERVICE,
      useFactory: (jwt: JwtService) => new JwtTokenService(jwt),
      inject: [JwtService],
    },

    {
      provide: RegisterUserUseCase,
      useFactory: (repo, hasher) => new RegisterUserUseCase(repo, hasher),
      inject: [USER_REPOSITORY, PASSWORD_HASHER],
    },
    {
      provide: LoginUseCase,
      useFactory: (repo, hasher, tokenService) => new LoginUseCase(repo, hasher, tokenService),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_SERVICE],
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
