import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/entities/user-role.enum';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { PasswordHasherPort } from '../../domain/ports/password-hasher.port';
import { UserAlreadyExistsError } from '../../domain/errors/user.errors';
import { RegisterUserCommand } from '../dto/register-user.command';

export class RegisterUserUseCase {
  constructor(
    private readonly repo: UserRepositoryPort,
    private readonly hasher: PasswordHasherPort,
  ) {}

  async execute(cmd: RegisterUserCommand): Promise<User> {
    const email = cmd.email.trim().toLowerCase();
    const existing = await this.repo.findByEmail(email);
    if (existing) throw new UserAlreadyExistsError();

    const passwordHash = await this.hasher.hash(cmd.password);
    const user = User.createNew({ email, passwordHash, role: UserRole.CUSTOMER });
    user.validate();

    return this.repo.create(user);
  }
}
