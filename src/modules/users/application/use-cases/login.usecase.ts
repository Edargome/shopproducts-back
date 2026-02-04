import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { PasswordHasherPort } from '../../domain/ports/password-hasher.port';
import { TokenServicePort } from '../../domain/ports/token-service.port';
import { InvalidCredentialsError } from '../../domain/errors/user.errors';
import { LoginCommand } from '../dto/login.command';

export class LoginUseCase {
  constructor(
    private readonly repo: UserRepositoryPort,
    private readonly hasher: PasswordHasherPort,
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(cmd: LoginCommand): Promise<{ accessToken: string }> {
    const email = cmd.email.trim().toLowerCase();
    const user = await this.repo.findByEmail(email);
    if (!user || !user.isActive) throw new InvalidCredentialsError();

    const ok = await this.hasher.compare(cmd.password, user.passwordHash);
    if (!ok) throw new InvalidCredentialsError();

    const accessToken = await this.tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }
}
