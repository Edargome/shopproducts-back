import { Actor } from './actor';
import { UserRole } from '../../modules/users/domain/entities/user-role.enum';
import { ForbiddenError } from '../errors/forbidden.error';

export function requireAdmin(actor: Actor) {
  if (!actor || actor.role !== UserRole.ADMIN) {
    throw new ForbiddenError('Admin role required');
  }
}