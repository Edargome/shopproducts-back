import { JwtService } from '@nestjs/jwt';
import { TokenServicePort } from '../../domain/ports/token-service.port';

export class JwtTokenService implements TokenServicePort {
  constructor(private readonly jwt: JwtService) {}

  sign(payload: { sub: string; email: string; role: string }): Promise<string> {
    return this.jwt.signAsync(payload);
  }
}
