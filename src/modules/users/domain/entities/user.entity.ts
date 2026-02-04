import { UserRole } from './user-role.enum';

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public passwordHash: string,
    public role: UserRole,
    public isActive: boolean,
    public updatedAt: Date,
    public createdAt: Date,
  ) {}

  static createNew(params: {
    email: string;
    passwordHash: string;
    role?: UserRole;
  }): User {
    const now = new Date();
    return new User(
      '',
      params.email.trim().toLowerCase(),
      params.passwordHash,
      params.role ?? UserRole.CUSTOMER,
      true,
      now,
      now,
    );
  }

  validate(): void {
    if (!this.email || !this.email.includes('@')) throw new Error('Invalid email');
    if (!this.passwordHash || this.passwordHash.length < 20) throw new Error('Invalid password hash');
    if (!this.role) throw new Error('Invalid role');
  }
}
