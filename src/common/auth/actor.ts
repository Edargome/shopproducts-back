import { UserRole } from '../../modules/users/domain/entities/user-role.enum';

export type Actor = {
  userId: string;
  email: string;
  role: UserRole;
};