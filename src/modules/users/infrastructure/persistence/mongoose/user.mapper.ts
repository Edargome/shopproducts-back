import { User } from '../../../domain/entities/user.entity';
import { UserDocument } from './user.schema';
import { UserRole } from '../../../domain/entities/user-role.enum';

export class UserMapper {
  static toDomain(doc: UserDocument): User {
    return new User(
      doc._id.toString(),
      doc.email,
      doc.passwordHash,
      doc.role as UserRole,
      doc.isActive,
      doc.updatedAt,
      doc.createdAt,
    );
  }

  static toDomainFromLean(d: any): User {
    return new User(
      d._id.toString(),
      d.email,
      d.passwordHash,
      d.role as UserRole,
      d.isActive ?? true,
      d.updatedAt ?? new Date(),
      d.createdAt ?? new Date(),
    );
  }
}
