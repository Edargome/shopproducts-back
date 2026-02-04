import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Actor } from './actor';
import { UserRole } from '../../modules/users/domain/entities/user-role.enum';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const header = req.headers?.authorization ?? req.headers?.Authorization;
    if (!header || typeof header !== 'string') {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization format');
    }

    try {
      const payload: any = await this.jwt.verifyAsync(token);

      // payload esperado: { sub, email, role }
      if (!payload?.sub || !payload?.email || !payload?.role) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const actor: Actor = {
        userId: String(payload.sub),
        email: String(payload.email),
        role: payload.role as UserRole,
      };

      req.user = actor;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
